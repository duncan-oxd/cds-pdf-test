<template>
  <v-app dark>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'PdfLayout',
  data() {
    return {}
  },
}
</script>

<style lang="scss">
html {
  // override/unset vuetify styles that cause problems with the PDF converter
  overflow: unset;

  // https://github.com/puppeteer/puppeteer/issues/5284
  // print-color-adjust: exact;
  // filter: opacity(1);

  // print-color-adjust: exact;
  // filter: blur(0);
}
</style>
