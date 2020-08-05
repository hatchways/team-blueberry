const aws = require("aws-sdk/");
const S3_BUCKET = process.env.S3_BUCKET;
const S3_URI = (fileName) =>
  `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;

aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const persistAvatar = async (req, res) => {
  // set s3 params
  // ? get file name from bin ?
  const fileName = req.user.id;
  const s3 = new aws.S3();
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: req.contentType,
    ACL: "public-read",
  };

  // obtain signedURL
  const [data, uri] = await s3.getSignedUrl(
    "putObject",
    s3Params,
    (err, data) => {
      if (err) {
        throw new Error({ status: 424, message: err });
      }
      return [data, S3_URI(fileName)];
    }
  );

  // Persist file in S3 Bucket
  await s3.putObject(s3Params, (err, data) => {
    if (err) {
      throw new Error({ status: 424, message: err });
    }
  });
  return uri;
};

module.exports = persistAvatar;
