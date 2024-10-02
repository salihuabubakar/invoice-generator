// next.config.js

import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add file-loader rule for font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath: 'static/fonts/',
            publicPath: '/_next/static/fonts/',
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
