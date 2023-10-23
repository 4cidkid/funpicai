/** @type {import('next').NextConfig} */
if (
    process.env.LD_LIBRARY_PATH == null ||
    !process.env.LD_LIBRARY_PATH.includes(
      `${process.env.PWD}/node_modules/canvas/build/Release:`,
    )
  ) {
    process.env.LD_LIBRARY_PATH = `${
      process.env.PWD
    }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
  }
const nextConfig = {
    images:{
        remotePatterns:[{
            protocol:"https",
            hostname:"oaidalleapiprodscus.blob.core.windows.net",
            port:""
        }]
    }
}

module.exports = nextConfig
