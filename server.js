const express = require('express')
const path = require('path')
const cors = require('cors')

const imgRouter = require('./imgRouter.js')

const {Storage} = require( '@google-cloud/storage' )

const gc = new Storage({
  keyFilename: path.join(__dirname, "./panda-react-greeting-e4163ec23eac.json"),
  projectId: 'panda-react-greeting'
})

  // gc.getBuckets().then(x => console.log(x))

  const pandaFiles = gc.bucket('pandabucket-test')
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  const stringMonth = month.toString()
  const stringDay = day.toString()
  

  //user-events_2021_02_05_OCCDEC_NORTH_STS_2021-02-05T06_35_13.754919,CTS_2021-02-05T07_35_12.540556,IP_94.254.32.28,DID_OCCDEC_NORTH,CL_my_class,LOC__56.58183_16.41551.wav

  // console.log(pandaFiles)
  const filePath = 'umaruuun.jfif'
  const destFilename = `${stringMonth}/${stringDay}/anime4.jfif`
  async function uploadFile() {
    await gc.bucket('pandabucket-test').upload(filePath, {
      destination: destFilename,
    })
  }
  async function getStorageFiles() {

    const [files] = await gc.bucket('pandabucket-test').getFiles();
    let result = [];
    files.forEach(file => {
      result.push(file.name);
    });
  
    // Send the result upon a successful request
    // res.status(200).send(result).end();
    console.log(result);
  }

  async function generateV4ReadSignedUrl() {
    // These options will allow temporary read access to the file
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
  
    // Get a v4 signed URL for reading the file
    const [url] = await gc
      .bucket('pandabucket-test')
      .file('user-events_2021_02_05_OCCDEC_NORTH_STS_2021-02-05T06_35_13.754919,CTS_2021-02-05T07_35_12.540556,IP_94.254.32.28,DID_OCCDEC_NORTH,CL_my_class,LOC__56.58183_16.41551.wav')
      .getSignedUrl(options);
  
    console.log('Generated GET signed URL:');
    console.log(url);
    console.log('You can use this URL with any user agent, for example:');
    console.log(`curl '${url}'`);
  }



const app = express()

app.use(cors())

app.use(express.static("panda-client/build"))

const PORT = process.env.PORT || 8080

app.get('/api/greeting', (req,res) => {
    const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

// app.use('/image-test', imgRouter)

uploadFile()
getStorageFiles()
// generateV4ReadSignedUrl()

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "panda-client", "build", "index.html"))
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))