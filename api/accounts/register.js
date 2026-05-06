import { handleAccountApi } from "../_account-api.js";

export default function handler(req, res) {
  return handleAccountApi(req, res, "/api/accounts/register");
}
