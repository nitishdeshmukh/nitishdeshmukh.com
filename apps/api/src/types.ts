export type Env = {
  Bindings: {
    DB: D1Database;
    ASSETS_BUCKET: R2Bucket;
    API_SECRET: string;
    ALLOWED_ORIGINS: string;
    PUSHER_APP_ID: string;
    PUSHER_KEY: string;
    PUSHER_SECRET: string;
    PUSHER_CLUSTER: string;
  };
};
