import { metricsById } from '../constants/metrics';

// eslint-disable-next-line import/prefer-default-export
export const metric = {
  encode: m => (m.value ? m.value : m),
  decode: metricId => metricsById[metricId],
};
