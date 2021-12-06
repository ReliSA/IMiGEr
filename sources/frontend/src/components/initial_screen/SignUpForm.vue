<template>
  <div class="col-md-9 col-lg-6 col-xl-5 separated p-5">
    <h1 class="text-center">Sign-up</h1>

    <form @submit.prevent="submit">
      <div class="form-outline mb-3">
        <label class="form-label" for="register_name">Name</label>
        <input id="register_name" type="text" class="form-control form-control-lg"
               placeholder="John Doe"/>
      </div>

      <div class="form-outline mb-3">
        <label class="form-label" for="register_uname">Username</label>
        <input id="register_uname" type="text" class="form-control form-control-lg"
               placeholder="johndoe123"/>
      </div>

      <div class="form-outline mb-3">
        <label class="form-label" for="register_email">Email address</label>
        <input id="register_email" type="email" class="form-control form-control-lg"
               placeholder="john@doe.gov.sh"/>
      </div>

      <div class="form-outline mb-3">
        <label class="form-label" for="register_pass">Password</label>
        <input type="password" id="register_pass" class="form-control form-control-lg"
               placeholder="Enter password"/>
      </div>

      <div class="form-outline mb-3">
        <label class="form-label" for="register_pass2">Password (repeated)</label>
        <input type="password" id="register_pass2" class="form-control form-control-lg"
               placeholder="Enter password"/>
      </div>

      <div class="text-center text-lg-start mt-4 pt-2">
        <button type="submit" class="btn btn-primary btn-lg btn-customized"
                style="padding-left: 2.5rem; padding-right: 2.5rem;">Register
        </button>
      </div>

    </form>
  </div>
</template>
<script>
export default {
  name: 'SignUpForm',
  props: {
    register: {}
  },
  methods: {
    submit(){
      alert("REGISTER: not implemented yet");
    }
  }
}
</script>
<style scoped>

.separated {
  border-right: 1px solid lightblue;
}

</style>