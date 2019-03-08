<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <input type="file" id="file" :name="files" @change="newimg" accept="image/*"/>
      <button @click="click">Try</button>
    </div>
    <div>
      <canvas id="srcimg" ref="srcimg" class="imgcanvas"></canvas>
      <canvas id="dstimg" ref="dstimg" class="imgcanvas"></canvas>
      <img src="@/assets/zoey-pic.jpg" ref="img" class="img"></img>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Main',
  props: {
    msg: String
  },
  data () {
    return {
      faceClass: null,
      eyeClass: null,
      files: []
    }
  },
  precreate () {
  },
  created () {
    let info = this.$cv.getBuildInformation()
    console.log('main created', info, this.$cv);

    let cascadeFile = 'haarcascade_frontalface_default.xml'
    this.createFileFromURL(cascadeFile, cascadeFile, (face) => {this.faceClass = face})
    cascadeFile = 'haarcascade_eye.xml'
    this.createFileFromURL(cascadeFile, cascadeFile, (eye) => {this.eyeClass = eye})
  },
  mounted () {
    this.loadImg()

    let requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    let fs = requestFileSystem(TEMPORARY, 1024*1024, (fs) => {
      console.log(fs)
      let rdr = fs.root.createReader()
      let ent = []
      rdr.readEntries((rslt) => {
        console.log(rslt)
        for (let itm of rslt) {
          console.log(itm);
        }
      })
    })
  },
  methods: {
    newimg(evt) {
      let files = evt.target.files
      if (!files.length) return
      let imgurl = URL.createObjectURL(files[0])
      let img = this.$refs.img
      img.src = imgurl
      console.log('file',files[0]);
    },
    click(evt) {
      console.log('click')
      let src = this.$cv.imread(this.$refs.srcimg)
      let gray = new this.$cv.Mat()
      this.$cv.cvtColor(src,gray, this.$cv.COLOR_RGBA2GRAY)
      let faces = new this.$cv.RectVector()
      let eyes = new this.$cv.RectVector()
      let msize = new this.$cv.Size(0,0)
      this.faceClass.detectMultiScale(gray, faces, 1.1, 3,0, msize, msize)
      for (let i=0;i<faces.size();i++) {
        let roiGray = gray.roi(faces.get(i))
        let roiSrc = src.roi(faces.get(i))
        let point1 = new this.$cv.Point(faces.get(i).x, faces.get(i).y);
        let point2 = new this.$cv.Point(faces.get(i).x + faces.get(i).width,
                              faces.get(i).y + faces.get(i).height);
        this.$cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        this.eyeClass.detectMultiScale(roiGray, eyes);
        for (let j = 0; j < eyes.size(); ++j) {
          let point1 = new this.$cv.Point(eyes.get(j).x, eyes.get(j).y);
          let point2 = new this.$cv.Point(eyes.get(j).x + eyes.get(j).width,
                                  eyes.get(j).y + eyes.get(j).height);
          this.$cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
        }
        roiGray.delete(); roiSrc.delete();
      }
      this.$cv.imshow(this.$refs.dstimg, src)
      src.delete();gray.delete();faces.delete(); eyes.delete();
    },
    createFileFromURL(file, url, cb) {
      axios.get('/models/haarcascades/' + url)
      .then((resp) => {
        let rtn = this.$cv.FS_createDataFile('/', file, resp.data, true, false, false)
        if (!rtn) return cb(null)
        let classifier = new this.$cv.CascadeClassifier()
        rtn = classifier.load(file)
        if (!rtn) return cb(null)

        cb(classifier)
        // eslint-disable-next-line
        console.log('loaded', rtn, classifier.empty(), this.faceClass)

      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log('ERR',err);
      })
    },
    loadImg(){
      let src = this.$refs.srcimg
      let ctx = src.getContext('2d')
      let img = this.$refs.img //new Image()

      img.onload = function() {
        src.height = img.height
        src.width = img.width
        ctx.drawImage(img, 0 ,0)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imgcanvas {
  width: 256px;
  height: 256px;
  border: 2px solid #000;
  margin: 10px;
}
.img {
  visibility: hidden;
}
#file {
  float: left;
}
</style>
