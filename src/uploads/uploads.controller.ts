import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'vicion-food';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_PRIVATE_KEY,
      },
    });
    try {
      const urls = [];
      files.map((file) => {
        const objectName = `${Date.now() + file.originalname}`;
        new AWS.S3()
          .putObject({
            Body: file.buffer,
            Bucket: BUCKET_NAME,
            Key: objectName,
            ACL: 'public-read',
          })
          .promise();
        const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
        urls.push(url);
      });
      console.log(urls);
      return urls;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
