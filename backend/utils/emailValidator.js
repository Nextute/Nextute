import dns from "dns";

const isValidEmailDomain = async (domain) => {
  try {
    // Check if domain has MX records
    const mxRecords = await dns.promises.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

export { isValidEmailDomain };
