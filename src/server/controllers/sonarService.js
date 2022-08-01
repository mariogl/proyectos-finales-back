const { default: axios } = require("axios");

const sonarService = async (projects) => {
  const getSonarFrontAPIURL = (project) =>
    `https://sonarcloud.io/api/measures/component?component=${project.sonarKey.front}&metricKeys=sqale_index,code_smells,bugs,vulnerabilities,security_hotspots,coverage`;
  const getSonarBackAPIURL = (project) =>
    `https://sonarcloud.io/api/measures/component?component=${project.sonarKey.back}&metricKeys=sqale_index,code_smells,bugs,vulnerabilities,security_hotspots,coverage`;

  const projectsFrontPromises = [];
  const projectsBackPromises = [];

  projects.forEach((project) => {
    if (project.sonarKey.front) {
      projectsFrontPromises.push(axios.get(getSonarFrontAPIURL(project)));
    }

    if (project.sonarKey.back) {
      projectsBackPromises.push(axios.get(getSonarBackAPIURL(project)));
    }
  });

  let projectsFrontMeasures;
  let projectsBackMeasures;

  if (projectsFrontPromises?.length) {
    projectsFrontMeasures = await Promise.all(projectsFrontPromises);
  }

  if (projectsBackPromises?.length) {
    projectsBackMeasures = await Promise.all(projectsBackPromises);
  }

  let debtFront;
  let codeSmellsFront;
  let bugsFront;
  let vulnerabilitiesFront;
  let coverageFront;
  let securityHotspotsFront;

  let debtBack;
  let codeSmellsBack;
  let bugsBack;
  let vulnerabilitiesBack;
  let coverageBack;
  let securityHotspotsBack;

  const resultProjects = projects.map((project, position) => {
    if (project.sonarKey.front) {
      const { measures: measuresFront } =
        projectsFrontMeasures[position].data.component;

      debtFront = measuresFront.find(
        (measure) => measure.metric === "sqale_index"
      ).value;

      codeSmellsFront = measuresFront.find(
        (measure) => measure.metric === "code_smells"
      ).value;

      bugsFront = measuresFront.find(
        (measure) => measure.metric === "bugs"
      ).value;

      vulnerabilitiesFront = measuresFront.find(
        (measure) => measure.metric === "vulnerabilities"
      ).value;

      coverageFront = measuresFront.find(
        (measure) => measure.metric === "coverage"
      )?.value;

      securityHotspotsFront = measuresFront.find(
        (measure) => measure.metric === "security_hotspots"
      ).value;
    }

    if (project.sonarKey.back) {
      const { measures: measuresBack } =
        projectsBackMeasures[position].data.component;

      debtBack = measuresBack.find(
        (measure) => measure.metric === "sqale_index"
      ).value;

      codeSmellsBack = measuresBack.find(
        (measure) => measure.metric === "code_smells"
      ).value;

      bugsBack = measuresBack.find(
        (measure) => measure.metric === "bugs"
      ).value;

      vulnerabilitiesBack = measuresBack.find(
        (measure) => measure.metric === "vulnerabilities"
      ).value;

      coverageBack = measuresBack.find(
        (measure) => measure.metric === "coverage"
      )?.value;

      securityHotspotsBack = measuresBack.find(
        (measure) => measure.metric === "security_hotspots"
      ).value;
    }

    let transformedProject;

    if (project.sonarKey.front || project.sonarKey.back) {
      transformedProject = {
        ...project,
        id: project._id,
      };
    }

    if (project.sonarKey.front) {
      transformedProject = {
        ...transformedProject,
        sonarInfoFront: {
          debt: debtFront,
          codeSmells: codeSmellsFront,
          bugs: bugsFront,
          vulnerabilities: vulnerabilitiesFront,
          securityHotspots: securityHotspotsFront,
          coverage: coverageFront,
        },
      };
    }

    if (project.sonarKey.back) {
      transformedProject = {
        ...transformedProject,
        sonarInfoBack: {
          debt: debtBack,
          codeSmells: codeSmellsBack,
          bugs: bugsBack,
          vulnerabilities: vulnerabilitiesBack,
          securityHotspots: securityHotspotsBack,
          coverage: coverageBack,
        },
      };
    }
    delete transformedProject._id;

    return transformedProject;
  });
  return resultProjects;
};

module.exports = sonarService;
