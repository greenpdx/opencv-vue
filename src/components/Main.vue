<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

  </div>
</template>

<script>
import axios from 'axios'
import * as cv from 'opencv.js'

export default {
  name: 'Main',
  props: {
    msg: String
  },
  data () {
    return {

    }
  },
  precreate () {
  },
  created () {
    //console.log(cv)
    try {
      let info = cv.getBuildInformation()
      // eslint-disable-next-line
      console.log('INFO\n', info)
    }
    catch(err) {
      console.log('info',err);
    }
  },
  mounted () {
    let cascadeFile = 'haarcascade_frontalface_default.xml'
    this.createFileFromURL(cascadeFile, cascadeFile, this.loadCascade )
  },
  methods: {
    createFileFromURL(file, url, cb) {
      axios.get('/models/haarcascades/haarcascade_frontalface_default.xml')
      .then((resp) => {
        let rtn = cv.FS_createDataFile('/', file, resp.data, true, false, false)
        cb()

      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log('ERR',err);
      })
    },
    loadCascade() {
      console.log('new class');
      let classifier = new cv.CascadeClassifier()
      console.log('class load');
      let rtn = classifier.load('haarcascade_fullbody.xml')
      // eslint-disable-next-line
      console.log('loaded', rtn, classifier.empty())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
