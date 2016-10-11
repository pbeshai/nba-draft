import { Formatters } from 'react-taco-table';

function identity(d) {
  return d;
}

function dataDefinition(props) {
  return {
    ...props,
    longLabel: props.longLabel || props.label,
    formatter: props.formatter || identity,
    shortFormatter: props.shortFormatter || props.formatter || identity,
  };
}

function metric(props) {
  return {
    ...dataDefinition(props),
    dataType: 'metric',
  };
}

export const metricsById = {
  draftYear: metric({
    id: 'draftYear',
    label: 'Draft Year',
  }),
  draftPick: metric({
    id: 'draftPick',
    label: 'Draft Pick',
  }),
  seasons: metric({
    id: 'seasons',
    label: 'Seasons',
  }),
  gp: metric({
    id: 'gp',
    label: 'Games Played',
    formatter: Formatters.commaFormat,
  }),
  min: metric({
    id: 'min',
    label: 'Minutes',
    formatter: Formatters.commaFormat,
  }),
  pts: metric({
    id: 'pts',
    label: 'Points',
    formatter: Formatters.commaFormat,
  }),
  trb: metric({
    id: 'trb',
    label: 'Rebounds',
    formatter: Formatters.commaFormat,
  }),
  ast: metric({
    id: 'ast',
    label: 'Assist',
    formatter: Formatters.commaFormat,
  }),
  fgpct: metric({
    id: 'fgpct',
    label: 'FG%',
    formatter: Formatters.percentFormat(1),
    shortFormatter: Formatters.percentFormat(0),
  }),
  fg3pct: metric({
    id: 'fg3pct',
    label: '3PT FG%',
    formatter: Formatters.percentFormat(1),
    shortFormatter: Formatters.percentFormat(0),
  }),
  ftpct: metric({
    id: 'ftpct',
    label: 'FT%',
    formatter: Formatters.percentFormat(1),
    shortFormatter: Formatters.percentFormat(0),
  }),
  minpg: metric({
    id: 'minpg',
    label: 'Minutes per game',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
  ptspg: metric({
    id: 'ptspg',
    label: 'Points per game',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
  trbpg: metric({
    id: 'trbpg',
    label: 'Rebounds per game',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
  astpg: metric({
    id: 'astpg',
    label: 'Assists per game',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
  ws: metric({
    id: 'ws',
    label: 'Win Shares',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
  wsper48: metric({
    id: 'wsper48',
    label: 'Win Shares per 48',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
  bpm: metric({
    id: 'bpm',
    label: 'BPM',
    formatter: Formatters.plusMinusFormat(1),
    shortFormatter: Formatters.plusMinusFormat(0),
  }),
  vorp: metric({
    id: 'vorp',
    label: 'VORP',
    formatter: Formatters.decFormat(1),
    shortFormatter: Formatters.decFormat(0),
  }),
};

export default [
  metricsById.draftYear,
  metricsById.draftPick,
  metricsById.seasons,
  metricsById.gp,
  metricsById.min,
  metricsById.pts,
  metricsById.trb,
  metricsById.ast,
  metricsById.fgpct,
  metricsById.fg3pct,
  metricsById.ftpct,
  metricsById.minpg,
  metricsById.ptspg,
  metricsById.trbpg,
  metricsById.astpg,
  metricsById.ws,
  metricsById.wsper48,
  metricsById.bpm,
  metricsById.vorp,
];
