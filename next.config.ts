import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // ваши конфигурационные параметры здесь
};

export default withNextIntl(nextConfig);
