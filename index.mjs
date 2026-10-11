import { makeFetchRequest } from "./utils.mjs";

const userData = await makeFetchRequest("tomdu3");
console.log(JSON.stringify(userData, null, 2));
