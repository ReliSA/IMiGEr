<template>
    <form class="text-start" @submit.prevent="upload_diagram">
      <p class="text-start">New Graph</p>
      <hr>
      <div class="mb-3">
        <fieldset>
          <legend>Choose graph type:</legend>
          <div class="form-check ms-5">
            <input class="form-check-input" type="radio" value="raw" id="json_graph" name="fileFormat"
                   v-model="fileFormat">
            <label class="form-check-label" for="json_graph">JSON</label>
          </div>
          <div v-for="(v, k) in modules" :key="k" class="form-check  ms-5">
            <upload-method :method_id="k" :method_name="v" v-model="fileFormat"/>
          </div>
        </fieldset>
      </div>
      <div class="mb-3">
        <fieldset>
          <legend>Visualization options:</legend>
          <div class="form-check ms-5">
            <input class="form-check-input" type="checkbox" value="IE" id="IE" name="IE">
            <label class="form-check-label" for="IE">Initial Elimination</label>
          </div>
        </fieldset>
      </div>
      <div class="mb-3">
        <legend for="formFile" class="form-label">Graph file</legend>
        <input class="form-control" type="file" id="formFile" name="input_graph" @change="upload_file" ref="file">
      </div>
      <div class="form-group text-center mb-3">
        <button type="submit" class="btn btn-primary btn-customized">Submit</button>
      </div>
    </form>
</template>
<script>
import UploadMethod from "@/components/initial_screen/UploadMethod"

export default {
  name: 'UploadDiagramForm',
  components: {UploadMethod},
  data(){
    return {
      fileFormat: 'raw',
      file: null,
    }
  },
  props: {
    modules: {},
    api_base_path: {}
  },
  methods: {
    upload_diagram(){
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
                let graph_json;
                try {
                  graph_json = JSON.parse(json["graph_json"]);
                }catch (e) {
                  this.$emit('failure', e);
                }
                this.$emit('diagram_retrieved', graph_json);
              });

            } else {

              response.json().then(json => {
                this.$emit('failure', json["error_message"]);
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

</style>