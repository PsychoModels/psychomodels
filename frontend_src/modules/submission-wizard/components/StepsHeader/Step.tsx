import React from "react";
import { Seperator } from "./Seperator.tsx";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useMatches, Link } from "@tanstack/react-router";

interface Props {
  stepNumber: number;
  route:
    | "/"
    | "/account"
    | "/model-information"
    | "/publication-details"
    | "/review"
    | "/submitted";
  title?: string;
  addSeparator?: boolean;
  isCompleted: boolean;
  allowNavigate?: boolean;
}

interface ConditionalLinkProps {
  useLink: boolean;
  to: string;
  children: React.ReactNode;
}

const ConditionalLink = ({ useLink, to, children }: ConditionalLinkProps) => {
  return useLink ? (
    <Link to={to}>{children}</Link>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );
};

export const Step = ({
  route,
  title = "",
  addSeparator,
  stepNumber,
  isCompleted,
  allowNavigate = true,
}: Props) => {
  const match = useMatches();
  const isCurrent = match.slice(-1)[0]?.id === route;

  if (isCurrent) {
    return (
      <li className="relative md:flex md:flex-1">
        <div
          className="flex items-center px-6 py-4 text-sm font-medium"
          aria-current="step"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-cyan-800">
            <span className="text-secondary">{stepNumber}</span>
          </span>
          <span className="ml-4 text-sm font-medium text-secondary">
            {title}
          </span>
        </div>
        {addSeparator && <Seperator />}
      </li>
    );
  }

  if (isCompleted) {
    return (
      <li className="relative md:flex md:flex-1">
        <ConditionalLink useLink={isCompleted && allowNavigate} to={route}>
          <div className="group flex w-full items-center">
            <span className="flex items-center px-6 py-4 text-sm font-medium">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-700">
                <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              <span className="ml-4 text-sm font-medium text-cyan-700">
                {title}
              </span>
            </span>
          </div>
          {addSeparator && <Seperator />}
        </ConditionalLink>
      </li>
    );
  }

  return (
    <li className="relative md:flex md:flex-1">
      <ConditionalLink useLink={isCompleted && allowNavigate} to={route}>
        <div className="group flex items-center">
          <span className="flex items-center px-6 py-4 text-sm font-medium">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
              <span className="text-gray-500">{stepNumber}</span>
            </span>
            <span className="ml-4 text-sm font-medium text-gray-500">
              {title}
            </span>
          </span>
        </div>
        {addSeparator && <Seperator />}
      </ConditionalLink>
    </li>
  );
};
