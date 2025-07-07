import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

const isValidEmailDomain = async (domain) => {
  try {
    const mxRecords = await resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

export { isValidEmailDomain };
