import React from "react";
import useStore from "../submission-wizard/store/useStore.ts";
import { PsychologyModel } from "../../models";
import { FrameworkCard } from "../submission-wizard/components/ModelingFrameworkField/FrameworkCard.tsx";
import { PublicationMeta } from "../submission-wizard/components/DOIInputField/PublicationMeta.tsx";
import { CopyToClipboardButton } from "../shared/components/CopyToClipboardButton";
import NewWindowIcon from "../shared/components/Icons/NewWindowIcon.tsx";
import Markdown from "react-markdown";
import { SoftwarePackageCard } from "../submission-wizard/components/SoftwarePackageField/SoftwarePackageCard.tsx";
import { VariableCard } from "../submission-wizard/components/VariablesField/VariableCard.tsx";

export const DetailViewDevContent = () => {
  const {
    modelInformation,
    publicationDetails,
    programmingLanguages,
    frameworks,
    psychologyDisciplines,
  } = useStore((state) => state);

  const psychologyModel: PsychologyModel = {
    ...modelInformation,
    ...publicationDetails,
    programmingLanguage: programmingLanguages.find(
      (pl) => pl.id === publicationDetails.programmingLanguageId,
    )!,
    frameworks: modelInformation.frameworkIds.map(
      (id) => frameworks.find((f) => f.id === id)!,
    ),
    psychologyDisciplines: modelInformation.psychologyDisciplineIds.map(
      (id) => psychologyDisciplines.find((pd) => pd.id === id)!,
    ),
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1 rounded-lg p-4 gap-12 flex flex-col bg-white">
        <div>
          <h1 className="text-cyan-700 text-2lg text-md font-bold md:text-3xl mb-6">
            {psychologyModel.title}
          </h1>
          <p>{psychologyModel.shortDescription}</p>
        </div>
        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">
            Modeling frameworks
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {psychologyModel.frameworks.map((framework) => (
              <FrameworkCard key={framework.id} framework={framework} />
            ))}
          </div>
        </div>

        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">
            How does the model work
          </div>

          <Markdown className="markdown-body">
            {psychologyModel.explanation}
          </Markdown>

          <p></p>
        </div>

        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">Variables</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {psychologyModel.variables.map((variable) => (
              <VariableCard key={variable.id} modelVariable={variable} />
            ))}
          </div>
        </div>

        <div>
          <div className="font-bold text-gray-700 text-sm mb-2">
            Publication
          </div>
          <PublicationMeta
            doiValue={psychologyModel.publicationDOI}
            enabled={true}
            hideErrors={true}
          >
            {(publication) => <div className="">{publication}</div>}
          </PublicationMeta>
        </div>
      </div>
      <div className="w-[500px] rounded-lg bg-white gap-6 flex flex-col p-4">
        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">
            Psychology disciplines
          </div>

          <p>
            {psychologyModel.psychologyDisciplines
              .map((pd) => pd.name)
              .join(", ")}
          </p>
        </div>
        <div>
          <div className="font-bold text-gray-700 text-sm mb-2">DOI</div>
          <div className="flex">
            <CopyToClipboardButton
              text={`https://doi.org/${psychologyModel.publicationDOI}`}
            />

            <a
              href={`https://doi.org/${psychologyModel.publicationDOI}`}
              target="_blank"
              className="inline-flex items-center text-tertiary hover:underlin ml-2"
              rel="noreferrer"
            >
              {`https://doi.org/${psychologyModel.publicationDOI}`}
              <NewWindowIcon />
            </a>
          </div>
        </div>

        <div>
          <div className="font-bold text-gray-700 text-sm mb-2">
            Programming language
          </div>
          <p>{psychologyModel.programmingLanguage.name}</p>
        </div>
        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">
            Software packages
          </div>
          <div className="flex flex-col gap-4">
            {psychologyModel.softwarePackages.map((sp) => (
              <SoftwarePackageCard key={sp.id} softwarePackage={sp} />
            ))}
          </div>
        </div>
        {psychologyModel.codeRepositoryUrl && (
          <div>
            <div className="font-bold text-gray-700 text-sm mb-2">
              Code repository url
            </div>
            <p>
              <a
                href={psychologyModel.codeRepositoryUrl}
                target="_blank"
                className="inline-flex items-center text-tertiary hover:underlin"
                rel="noreferrer"
              >
                {psychologyModel.codeRepositoryUrl}
                <NewWindowIcon />
              </a>
            </p>
          </div>
        )}
        {psychologyModel.dataUrl && (
          <div>
            <div className="font-bold text-gray-700 text-sm mb-2">Data url</div>
            <p>
              <a
                href={psychologyModel.dataUrl}
                target="_blank"
                className="inline-flex items-center text-tertiary hover:underlin"
                rel="noreferrer"
              >
                {psychologyModel.dataUrl}
                <NewWindowIcon />
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
