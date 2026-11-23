// @ts-check
import { appRoot } from "@prisma/composer";
import hcPfpService from "./service.mjs";

export default appRoot("hcpfpv2", ({ provision }) => {
  provision(hcPfpService, { id: "hcpfp" });
});
