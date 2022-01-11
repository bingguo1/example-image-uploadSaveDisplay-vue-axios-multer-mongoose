<template>
<div>
	<input v-model="name" type="text" id="name" placeholder="Name" 
            name="name" required>
	<textarea v-model="desc" id="desc" name="desc"  rows="2" 
                          placeholder="Description" required> </textarea>
    <input type="file" @change="uploadFile" ref="file">
    <button @click="submitFile">Upload!</button>
</div>
</template>

<script>
import axios from "axios";
export default {
	name: 'App',
	data: () => ({
		images: null,
		name:"",
		desc:"",
	}),
	methods: {
		uploadFile() {
			this.Images = this.$refs.file.files[0];
		},
		submitFile() {
			const formData = new FormData();
			formData.append('image', this.Images);
			formData.append('name',this.name);
			formData.append('desc',this.desc);
			const headers = { 'Content-Type': 'multipart/form-data' };
			axios.post('http://localhost:3000/', formData, { headers }).then(() => {
				console.log("succeed");
			});
		}
    }
}
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
