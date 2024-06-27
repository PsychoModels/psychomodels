import React from "react";
import { SoftwarePackage } from "../../../../models";
import NewWindowIcon from "../../../shared/components/Icons/NewWindowIcon.tsx";
import useStore from "../../store/useStore.ts";

interface Props {
  softwarePackage: SoftwarePackage;
  actionButton?: React.ReactNode;
}

export const SoftwarePackageCard = ({
  softwarePackage,
  actionButton,
}: Props) => {
  const { programmingLanguages } = useStore((state) => state);

  const programmingLanguage = programmingLanguages.find(
    (pl) => pl.id == softwarePackage.programmingLanguageId,
  );

  return (
    <div className="p-4 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 relative">
      <h5 className="mb-2 font-semibold tracking-tight text-gray-900 dark:text-white ">
        {softwarePackage.name}
      </h5>

      <p className="my-3 text-sm">{softwarePackage.description}</p>

      {softwarePackage.documentationUrl && (
        <div className="text-sm mb-1">
          <span className="text-gray-600">Documentation:</span>{" "}
          <a
            href={softwarePackage.documentationUrl}
            target="_blank"
            className="inline-flex text-sm items-center text-blue-600 hover:underline"
            rel="noreferrer"
          >
            {softwarePackage.documentationUrl} <NewWindowIcon />
          </a>
        </div>
      )}

      {softwarePackage.codeRepositoryUrl && (
        <div className="text-sm mb-1">
          <span className="text-gray-600">Code repository:</span>{" "}
          <a
            href={softwarePackage.codeRepositoryUrl}
            target="_blank"
            className="inline-flex text-sm items-center text-blue-600 hover:underline"
            rel="noreferrer"
          >
            {softwarePackage.codeRepositoryUrl} <NewWindowIcon />
          </a>
        </div>
      )}

      <div className="text-sm mb-1">
        <span className="text-gray-600">Programming language:</span>{" "}
        {programmingLanguage?.name}
      </div>

      <div className="mt-4">{actionButton}</div>
    </div>
  );
};
