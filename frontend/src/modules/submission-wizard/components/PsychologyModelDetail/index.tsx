import React from "react";
import { PsychologyModel } from "../../../../models";
import { PublicationMeta } from "../DOIInputField/PublicationMeta.tsx";
import { FrameworkCard } from "../ModelingFrameworkField/FrameworkCard.tsx";
import NewWindowIcon from "../../../shared/components/Icons/NewWindowIcon.tsx";
import { CopyToClipboardButton } from "../../../shared/components/CopyToClipboardButton";
import { VariableCard } from "../VariablesField/VariableCard.tsx";
import Markdown from "react-markdown";
import { ExpandText } from "../../../shared/components/ExpandText";
import { SoftwarePackageCard } from "../SoftwarePackageField/SoftwarePackageCard.tsx";

interface Props {
  psychologyModel: PsychologyModel;
}

export const PsychologyModelDetail = ({ psychologyModel }: Props) => {
  return (
    <div>
      <div className="mb-2 text-gray-600">
        Please review the psychology model you are about to submit.
      </div>
      <div className="w-full max-w-7xl rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700 p-4 border-gray-300 border text-gray-600 gap-10 flex flex-col">
        <div>
          <h1 className="text-cyan-700 text-2lg text-md font-bold md:text-3xl">
            {psychologyModel.title}
          </h1>
          <p className="mt-4">{psychologyModel.shortDescription}</p>
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
            Psychology disciplines
          </div>

          <p>
            {psychologyModel.psychologyDisciplines
              .map((pd) => pd.name)
              .join(", ")}
          </p>
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
        <div>
          <div className="font-bold text-gray-700 text-sm mb-2">DOI</div>
          <div>
            <CopyToClipboardButton
              text={`https://doi.org/${psychologyModel.publicationDOI}`}
            />

            <a
              href={`https://doi.org/${psychologyModel.publicationDOI}`}
              target="_blank"
              className="inline-flex items-center text-blue-600 hover:underline ml-2"
              rel="noreferrer"
            >
              {`https://doi.org/${psychologyModel.publicationDOI}`}
              <NewWindowIcon />
            </a>
          </div>
        </div>
        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">
            How does the model work
          </div>
          <ExpandText>
            <Markdown className="markdown-body">
              {psychologyModel.explanation}
            </Markdown>
          </ExpandText>

          <p></p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="inline-flex items-center text-blue-600 hover:underline"
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
                className="inline-flex items-center text-blue-600 hover:underline"
                rel="noreferrer"
              >
                {psychologyModel.dataUrl}
                <NewWindowIcon />
              </a>
            </p>
          </div>
        )}
        <div>
          <div className="font-bold text-gray-700 text-sm mb-4">Variables</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {psychologyModel.variables.map((variable) => (
              <VariableCard key={variable.id} variable={variable} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
