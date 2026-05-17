import * as Minio from "minio"

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'giftan_admin)',
  secretKey: process.env.MINIO_SECRET_KEY || 'giftan_secure_password',
})