import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AttachmentUtils')
// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucket = process.env.ATTACHMENT_S3_BUCKET,
    private readonly signedUrlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) {}

  getAttachmentUrl(key: string): string {
    logger.info(`getAttachmentUrl - key ${key}`)
    const url = `https://${this.bucket}.s3.amazonaws.com/${key}`
    logger.info(`getAttachmentUrl - url ${url}`)
    return url
  }

  async getSignedUrl(key: string): Promise<string> {
    logger.info(`getSignedUrl - key ${key}`)
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: this.signedUrlExpiration
    })
    logger.info(`getSignedUrl - url: ${url}`)
    return url
  }
}
