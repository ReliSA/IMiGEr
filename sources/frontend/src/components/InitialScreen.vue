<template>
  <div class="row flex-grow-1 d-flex">
    <div v-if="modules === null"></div>
    <div v-else class="container w-100">
      <div v-if="show_error_popup" class="error popup">{{ message }}</div>
      <div v-if="show_notify_popup" class="notify popup">{{ message }}</div>

      <div id="switch_button">
        <button class="btn btn-primary btn-customized" @click="switch_context">{{ switch_button_text }}</button>
      </div>

      <!-- MAIN SCREEN -->

      <div v-if="main_screen" class="row h-100 justify-content-center align-items-center">
        <UploadDiagramForm :modules="modules" :api_base_path="api_base_path" @diagram_retrieved="handle_diagram"
                           @failure="handle_failure"/>
      </div>

      <!-- SIGNUP/IN -->

      <div v-else class="row h-100 justify-content-center align-items-center">
        <div class="container-fluid h-custom">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <SignUpForm />
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignUpForm from "@/components/initial_screen/SignUpForm";
import SignInForm from "@/components/initial_screen/SignInForm";
import UploadDiagramForm from "@/components/initial_screen/UploadDiagramForm";

export default {
  name: "InitialScreen",
  components: {UploadDiagramForm, SignInForm, SignUpForm},
  data() {
    return {
      show_error_popup: false,
      show_notify_popup: false,
      message: '',

      modules: null,
      api_base_path: process.env.VUE_APP_ROOT_API,

      main_screen: true,
      switch_button_texts: ["Login", "Back to main page"],
      switch_button_text: "Login"
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
    switch_context(){
      this.switch_button_text = this.switch_button_texts[+this.main_screen];
      this.main_screen = !this.main_screen;
    },
    handle_diagram(json){
      this.message = "Your graph is being loaded...";
      this.show_notify_popup = true;
      setTimeout(() => {this.show_notify_popup = false}, 3000);
      this.$emit('diagram_retrieved', json);
    },
    handle_failure(error_message){
      this.message = error_message;
      this.show_error_popup = true;
      setTimeout(() => {this.show_error_popup = false}, 3000);
    }
  }
}

</script>

<style scoped>
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

#switch_button {
  position: absolute;
  margin-top: 20px;
}

</style>