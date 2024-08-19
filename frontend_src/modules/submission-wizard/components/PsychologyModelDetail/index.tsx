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
import useStore from "../../store/useStore.ts";
import { MathJax } from "better-react-mathjax";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-gray-500 mb-2">{children}</div>
);

export const PsychologyModelDetail = () => {
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
      (pl) => pl.id == publicationDetails.programmingLanguageId,
    )!,
    frameworks: modelInformation.frameworkIds.map(
      (id) => frameworks.find((f) => f.id == id)!,
    ),
    psychologyDisciplines: modelInformation.psychologyDisciplineIds.map(
      (id) => psychologyDisciplines.find((pd) => pd.id == id)!,
    ),
    variables: publicationDetails.modelVariables,
  };

  return (
    <div>
      <div className="mb-2 text-gray-600">
        Please review the psychology model you are about to submit.
      </div>
      <div className="w-full p-4 border-gray-300 border text-gray-600 gap-10">
        <div className="h-[500px] overflow-scroll flex flex-col gap-8">
          <div>
            <h1 className="text-cyan-700 text-2lg text-md font-bold md:text-3xl">
              {psychologyModel.title}
            </h1>
            <p className="mt-2">{psychologyModel.shortDescription}</p>
          </div>
          <div>
            <Label>Modeling frameworks</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {psychologyModel.frameworks.map((framework) => (
                <FrameworkCard key={framework.id} framework={framework} />
              ))}
            </div>
          </div>

          {psychologyModel.psychologyDisciplines.length > 0 && (
            <div>
              <Label>Psychology disciplines</Label>

              <p>
                {psychologyModel.psychologyDisciplines
                  .map((pd) => pd.name)
                  .join(", ")}
              </p>
            </div>
          )}
          {psychologyModel.publicationDOI && (
            <>
              <div>
                <Label>Publication</Label>
                <PublicationMeta
                  doiValue={psychologyModel.publicationDOI}
                  enabled={true}
                  hideErrors={true}
                >
                  {(publication) => <div className="">{publication}</div>}
                </PublicationMeta>
              </div>

              <div>
                <Label>DOI</Label>
                <div>
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
            </>
          )}

          {psychologyModel.explanation && (
            <div>
              <Label>How does the model work</Label>
              <ExpandText>
                <MathJax>
                  <Markdown className="markdown-body">
                    {psychologyModel.explanation}
                  </Markdown>
                </MathJax>
              </ExpandText>
            </div>
          )}

          {psychologyModel.programmingLanguage && (
            <div>
              <Label>Programming language</Label>
              <p>{psychologyModel.programmingLanguage?.name}</p>
            </div>
          )}

          {psychologyModel.softwarePackages.length > 0 && (
            <div>
              <Label>Software packages</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {psychologyModel.softwarePackages.map((sp) => (
                  <SoftwarePackageCard key={sp.id} softwarePackage={sp} />
                ))}
              </div>
            </div>
          )}

          {psychologyModel.codeRepositoryUrl && (
            <div>
              <Label>Code repository url</Label>
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
              <Label>Data url</Label>
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

          {psychologyModel.variables.length > 0 && (
            <div>
              <Label>Variables</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {psychologyModel.variables.map((variable) => (
                  <VariableCard key={variable.id} modelVariable={variable} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
