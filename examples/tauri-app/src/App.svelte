<script>
  import { ping, print, SunmiPrinter } from "tauri-plugin-sunmi-api";
  import { SunmiFontSize } from "../../../dist-js/models";

  let response = "";

  function updateResponse(returnValue) {
    response +=
      `[${new Date().toLocaleTimeString()}] ` +
      (typeof returnValue === "string"
        ? returnValue
        : JSON.stringify(returnValue)) +
      "<br>";
  }

  function _ping() {
    ping("Pong!").then(updateResponse).catch(updateResponse);
  }
  async function _print() {
    // updateResponse(await print("printerPaper"));
    // updateResponse(await print("printerVersion"));
    updateResponse(await SunmiPrinter.serialNumber());
    // updateResponse(await print("initPrinter"));
    // updateResponse(await print("enterPrinterBuffer"));
    updateResponse(
      await SunmiPrinter.printText("XD", { fontSize: SunmiFontSize.MD })
    );
    // updateResponse(await print("printText"));
    // updateResponse(await print("printText"));
    // updateResponse(await print("printText"));
    // updateResponse(await print("printText"));
    // updateResponse(await print("printText"));
    // updateResponse(await print("printText"));
    // updateResponse(await print("cutPaper"));
    // updateResponse(await print("exitPrinterBuffer"));
  }

  async function _bind() {
    updateResponse(await SunmiPrinter.bindingPrinter());
  }
  async function _unbind() {
    updateResponse(await SunmiPrinter.unbindingPrinter());
  }
</script>

<main class="container">
  <h1>Welcome to Tauri!</h1>

  <div class="row">
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo vite" alt="Vite Logo" />
    </a>
    <a href="https://tauri.app" target="_blank">
      <img src="/tauri.svg" class="logo tauri" alt="Tauri Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank">
      <img src="/svelte.svg" class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>

  <p>Click on the Tauri, Vite, and Svelte logos to learn more.</p>
  <!-- 
  <div class="row">
    <Greet />
  </div> -->

  <div>
    <button on:click={_ping}>Ping</button>
    <button on:click={_bind}>Bind</button>
    <button on:click={_unbind}>Unbind</button>
    <button on:click={_print}>Print</button>
    <div>{@html response}</div>
  </div>
</main>

<style>
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>
