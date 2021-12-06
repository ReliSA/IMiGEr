<template>
  <div v-if="modules === null"></div>
  <div v-else class="container h-100 w-100">
    <div v-if="show_error_popup" class="error popup">{{ message }}</div>
    <div v-if="show_notify_popup" class="notify popup">{{ message }}</div>

    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-10 col-md-8 col-lg-6">
        <form class="text-center" @submit.prevent="submit">
          <h1>IMiGEr</h1>
          <p class="description">Interactive visualization of your graph data.</p>
          <div class="mb-3">
            <fieldset>
              <legend>Choose graph type:</legend>
              <div class="form-check form-check-custom">
                <input class="form-check-input" type="radio" value="raw" id="json_graph" name="fileFormat" v-model="fileFormat">
                <label class="form-check-label" for="json_graph">JSON</label>
              </div>
              <div v-for="(v, k) in modules" :key="k" class="form-check form-check-custom">
                <upload-method :method_id="k" :method_name="v" v-model="fileFormat"/>
              </div>
            </fieldset>
          </div>
          <div class="mb-3">
            <label for="formFile" class="form-label">Graph file</label>
            <input class="form-control" type="file" id="formFile" name="input_graph" @change="upload_file" ref="file">
          </div>
          <div class="form-group text-center mb-3">
            <button type="submit" class="btn btn-primary btn-customized">Submit</button>
          </div>
          <div class="form-group text-center">
            <p class="copyright">&copy; RELISA 2021</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UploadMethod from "@/components/initial_screen/UploadMethod";
export default {
  name: "InitialScreen",
  components: {UploadMethod},
  data() {
    return {
      show_error_popup: false,
      show_notify_popup: false,
      message: '',

      modules: null,
      api_base_path: process.env.VUE_APP_ROOT_API,
      fileFormat: '',
      file: null,
    }
  },
  created() {
    console.log(this.api_base_path);
    fetch(this.api_base_path + '/get-processing-modules')
        .then(response => response.json())
        .then(data => (this.modules = JSON.parse(data["processingModules"])))
        .catch(err => console.log(err));
  },
  methods: {
    submit(){
      const form_data = new FormData();
      form_data.append('file', this.file);
      form_data.append('fileFormat', this.fileFormat);
      if(this.file === null) {
        form_data.append('filename', '');
      }else{
        form_data.append('filename', this.file.name);
      }

      for (let key of form_data.entries()) {
        console.log(key[0] + ' -> ' + key[1]);
      }

      fetch(this.api_base_path + '/upload-diagram', {
        body: form_data,
        method: "post"
      })
        .then(response => {
          console.log(response.status);
          if (response.status === 200) {

            response.json().then(json => {
              let graph_json = JSON.parse(json["graph_json"]);
              this.message = "Your graph is being loaded...";
              this.show_notify_popup = true;
              setTimeout(() => {this.show_notify_popup = false}, 3000);
              this.$emit('diagram_retrieved', graph_json);
            });

          } else {

            response.json().then(json => {
              this.message = json["error_message"];
              this.show_error_popup = true;
              setTimeout(() => {this.show_error_popup = false}, 3000);
            });

          }
        })
        .catch(err => console.log(err));
    },
    upload_file(){
      this.file = this.$refs.file.files[0];
    }
  }
}

</script>

<style scoped>
.form-check-custom {
  position: relative;
  left: 40%;
  text-align: left;
}
.popup {
  position: absolute;
  top: 5px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  padding: 5px;
  border-radius: 10px 0 10px 0;
}

.error {
  background-color: #ffb1a9;
  border: 2px solid crimson;
}

.notify {
  background-color: #afffa9;
  border: 2px solid #49dc14;
}
</style>