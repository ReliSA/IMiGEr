<template>
  <div class="col-md-8 col-lg-6 col-xl-4 p-5">
    <h1 class="text-center">Sign-in</h1>

    <form @submit.prevent="submit">
      <div class="form-outline mb-4">
        <label class="form-label" for="form3Example3">Username</label>
        <input type="email" id="form3Example3" class="form-control form-control-lg"
               placeholder="johndoe123"/>
      </div>

      <div class="form-outline mb-3">
        <label class="form-label" for="form3Example4">Password</label>
        <input type="password" id="form3Example4" class="form-control form-control-lg"
               placeholder="Enter password"/>
      </div>

      <div class="text-center text-lg-start mt-4 pt-2">
        <button type="submit" class="btn btn-primary btn-lg"
                style="padding-left: 2.5rem; padding-right: 2.5rem;">Login
        </button>
      </div>

    </form>
  </div>
</template>
<script>
export default {
  name: 'SignInForm',
  props: {
    login: {}
  },
  methods: {
    submit(){
      alert("LOGIN: not implemented yet");
    }
  }
}
</script>
