const aws = require("aws-sdk/");
const S3_BUCKET = process.env.S3_BUCKET;

aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const persistAvatar = async (req, res) => {
  const fileName = req.user.id;
  const s3 = new aws.S3();
  const s3Params = {
    Body: req.body,
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: req.contentType,
    ACL: "public-read",
  };

  try {
    const { Location } = await s3.upload(s3Params).promise();
    return Location;
  } catch (err) {
    console.log(err);
    throw new Error({ status: 424, message: err });
  }
};

const persistProjectImg = async (req) => {
  if (Buffer.byteLength(req.body) === 0) return "";
  const fileName = `${req.user.id}${new Date().getTime()}`;
  const s3 = new aws.S3();
  const s3Params = {
    Body: req.body,
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: "image/jpg",
    ACL: "public-read",
  };

  try {
    const { Location } = await s3.upload(s3Params).promise();
    return Location;
  } catch (err) {
    console.log(err);
    throw new Error({ status: 424, message: err });
  }
};

module.exports = { persistAvatar, persistProjectImg };
