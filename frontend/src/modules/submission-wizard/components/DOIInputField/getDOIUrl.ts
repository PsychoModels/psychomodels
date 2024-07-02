export const getDOIUrl = (
  idToSend: string,
): {
  idToSend: string;
  url: string;
} | null => {
  idToSend = idToSend.replace(/ /g, "");
  let url = null;
  if (idToSend.match(/^(doi:|(https?:\/\/)?(dx\.)?doi\.org\/)?10\..+\/.+$/i)) {
    if (idToSend.match(/^doi:/i)) {
      idToSend = idToSend.substring(4);
    } else if (idToSend.indexOf("doi.org/") >= 0) {
      idToSend = idToSend.substr(idToSend.indexOf("doi.org/") + 8);
    }

    url = "/8350e5a3e24c153df2275c9f80692773/doi2bib";
  } else if (idToSend.match(/^\d+$|^PMC\d+(\.\d+)?$/)) {
    url = "/8350e5a3e24c153df2275c9f80692773/pmid2bib";
  } else if (idToSend.match(/^(arxiv:)?\d+\.\d+(v(\d+))?/i)) {
    if (idToSend.match(/^arxiv:/i)) {
      idToSend = idToSend.substring(6);
    }
    url = "/8350e5a3e24c153df2275c9f80692773/arxivid2bib";
  }

  if (url) {
    return { idToSend, url };
  }

  return null;
};
