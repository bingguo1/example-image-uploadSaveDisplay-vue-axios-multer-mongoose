<template>
  <div>
    <div>
      <input
        v-model="name"
        type="text"
        id="name"
        placeholder="Name"
        name="name"
        required
      />
    </div>
    <div>
      <textarea
        v-model="desc"
        id="desc"
        name="desc"
        rows="2"
        placeholder="Description"
        required
      >
      </textarea>
    </div>
    <input type="file" @change="uploadFile" ref="file" />
    <button @click="submitFile">Upload!</button>
  </div>
  <div>
    <div v-for="(imageblog, index) in imageblogs" :key="index">
      <img :src="getImageSrc(imageblog)" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data: () => ({
    newImage: null,
    imageblogs: [],
    name: "",
    desc: "",
  }),
  created() {
    let apiURL = "http://localhost:3000/listimages";
    axios
      .get(apiURL)
      .then((res) => {
        this.imageblogs = res.data;
        this.imageblogs.forEach((x) => console.log(x.name));
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    uploadFile() {
      this.newImage = this.$refs.file.files[0];
    },
    submitFile() {
      const formData = new FormData();
      formData.append("image", this.newImage);
      formData.append("name", this.name);
      formData.append("desc", this.desc);
      const headers = { "Content-Type": "multipart/form-data" };
      axios.post("http://localhost:3000/", formData, { headers }).then(() => {
        console.log("succeed");
      });
    },
    getImageSrc(imageblog) {
      //console.log("type:" + imageblog.img.contentType);
      return (
        "data:image/" +imageblog.img.contentType +";base64," +
        Buffer.from(imageblog.img.data.data, "binary").toString("base64")
      );
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
