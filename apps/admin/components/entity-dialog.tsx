"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Loader2 } from "lucide-react";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "url" | "date" | "boolean";
  placeholder?: string;
};

interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  schema: z.ZodSchema<any>;
  fields: FieldConfig[];
  defaultValues?: any;
  onSubmit: (values: any) => Promise<void>;
}

export function EntityDialog({
  open,
  onOpenChange,
  title,
  schema,
  fields,
  defaultValues,
  onSubmit,
}: EntityDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues || {});
    }
  }, [open, defaultValues, form]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "Create"} {title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem className="flex flex-col">
                    {field.type === "boolean" ? (
                      <div className="flex items-center space-x-2 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={formField.value}
                            onCheckedChange={formField.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {field.label}
                        </FormLabel>
                      </div>
                    ) : (
                      <>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input
                            {...formField}
                            type={
                              field.type === "number"
                                ? "number"
                                : field.type === "date"
                                ? "date"
                                : "text"
                            }
                            placeholder={field.placeholder}
                            value={formField.value ?? ""}
                            onChange={(e) => {
                              if (field.type === "number") {
                                formField.onChange(e.target.value === "" ? "" : Number(e.target.value));
                              } else {
                                formField.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
