<template>
  <div class="col-10 col-md-8 col-lg-6">
    <form class="text-center" @submit.prevent="upload_diagram">
      <h1>IMiGEr</h1>
      <p class="description">Interactive visualization of your graph data.</p>
      <div class="mb-3">
        <fieldset>
          <legend>Choose graph type:</legend>
          <div class="form-check form-check-custom">
            <input class="form-check-input" type="radio" value="raw" id="json_graph" name="fileFormat"
                   v-model="fileFormat">
            <label class="form-check-label" for="json_graph">JSON</label>
          </div>
          <div v-for="(v, k) in modules" :key="k" class="form-check form-check-custom">
            <upload-method :method_id="k" :method_name="v" v-model="fileFormat"/>
          </div>
        </fieldset>
      </div>
      <div class="mb-3">
        <fieldset>
          <legend>Visualization options:</legend>
          <div class="form-check form-check-custom">
            <input class="form-check-input" type="checkbox" value="timeline" id="timeline" name="timeline">
            <label class="form-check-label" for="timeline">Timeline</label>
          </div>
          <div class="form-check form-check-custom">
            <input class="form-check-input" type="checkbox" value="IE" id="IE" name="IE">
            <label class="form-check-label" for="IE">Initial Elimination</label>
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
</template>
<script>
import UploadMethod from "@/components/initial_screen/UploadMethod"

export default {
  name: 'UploadDiagramForm',
  components: {UploadMethod},
  data(){
    return {
      fileFormat: '',
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
            if (response.status === 200) {

              response.json().then(json => {
                let graph_json;
                try {
                  graph_json = JSON.parse(json["graph_json"]);
                  //console.log(graph_json);
                  this.$emit('diagram_retrieved', graph_json);
                }catch (e) {
                  this.$emit('failure', e);
                }
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