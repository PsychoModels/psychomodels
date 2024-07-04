import { StateCreator } from "zustand";
import { ModelVariable, SoftwarePackage } from "../../../../models";

type PublicationDetails = {
  explanation: string;
  programmingLanguageId: number | string;
  softwarePackages: SoftwarePackage[];
  variables: ModelVariable[];
  codeRepositoryUrl?: string;
  dataUrl?: string;
  publicationDOI?: string;
};

type PublicationDetailsSlice = {
  publicationDetails: PublicationDetails;
  setPublicationDetails: (data: PublicationDetails) => void;
};

const initialState = {
  explanation:
    "# Veliferam moenia et mirata maesto vulgares\n" +
    "\n" +
    "## Has est inde pleno vos adest pinxit\n" +
    "\n" +
    "Lorem markdownum hiatus Cartheia, tenui *ante fetus* sub artus, in. **Virgis\n" +
    "insilit** viret; incursant huic ecce neu poteram queat illo delata, nec vasta\n" +
    "*iam* mihi. Figuris adest proque aevo hunc consedit victa; quoque fulvis, nec!\n" +
    "Pectore accipe super proles gratissima esse dumque [pars\n" +
    "nomenque](http://glomeravitcauda.io/vultus-matrem.php) resedit silvas ira; dum\n" +
    "pronas maternis.\n" +
    "\n" +
    "    var status = 1 + linuxLocalhost + portJumper;\n" +
    "    dvd_localhost.opticCopyright += in_sli(name(1 + iphoneSkinMemory,\n" +
    "            spoolingCyberbullying));\n" +
    "    gamma(fsb_workstation_camera(gpu_printer, tokenKeystroke, icq) +\n" +
    "            troubleshooting_user, 2);\n" +
    "    if (megabitToken + partyNntp * gigabyte - public_thyristor -\n" +
    "            wrapPointCharacter) {\n" +
    "        inboxWinsockBoot(4 / sku);\n" +
    "        fileTorrent = cpuWep.podcast(adBufferHoneypot, tebibyte);\n" +
    "        pcmciaColumn = friendly_logic_computer;\n" +
    "    }\n" +
    "    spyware_recursive.hardware_netbios_ftp -= adware_icf + vdsl;\n" +
    "\n" +
    "Si instructamque rura venturis; aliter, lustrabere et subiere ornique; est\n" +
    "segnior. Aeacus in et bene. Tu [mandata](http://sues-sine.com/) inhibe ululasse\n" +
    "aequor poenas, aede mater fine est animis, est sperne quae inquinat iuga tamen.\n" +
    "Luxuriem placet, fulvos ne, tecta, crudelis in terra numen aberant, Stheneleius\n" +
    "**potui praemia pampineae**. Deorum nostros colla, si iuventae nostrae Cerealia!\n" +
    "\n" +
    "    processThroughputCdma.sampleSequenceEditor += keywordsChipsetDirect(58, 4,\n" +
    "            94 + infotainmentWDv) / terminalService;\n" +
    "    hibernateNasOpengl.systray -= tween_ethernet(rayDialEbook.software_import(\n" +
    "            bugConsoleDrm + grayscale, 200249 + box, 2));\n" +
    "    disk.olapDrive += zip + 783115;\n" +
    "    if (fatBezelDuplex(297747 + kilobit, cropComputingJson(4,\n" +
    "            primaryLeopardTag.dimm_ppm_key(bezel_wi, -1)), -2)) {\n" +
    "        dviSramWiki.reader_reality_tiff(\n" +
    "                atmDown.dynamic_word_petaflops.warm_directx_compiler(\n" +
    "                orientationSeo, record_toggle_ctr, biosSecondaryMarket));\n" +
    "        cursorCiscKeyboard += 88;\n" +
    "        pcmcia(1, -5);\n" +
    "    }\n" +
    "    driver.rte_json -= metadataUddiTime;\n" +
    "\n" +
    "## Sic fabula cauti vos\n" +
    "\n" +
    "[Deplorata carent sensisse](http://www.anno-comitique.org/) opus, locuti iste\n" +
    "adempta qui densetur rubor et siccat, patrumque reluctanti. Haemus flabat\n" +
    "fatale, humo aliter quem procul, magnanimi saturata una nimia, quibus confessus\n" +
    "stupet. Piceumque metit, est feror lumine sine, fraterque incurvae. Humum carae\n" +
    "cornuaque saepe furoribus lignoque umentes.\n" +
    "\n" +
    "    data.barcraft_mashup = alert.hertz.integratedDrive(internal_nosql_gnutella +\n" +
    "            sdk_crm - tweet, web_encryption);\n" +
    "    zip_click = java;\n" +
    "    webmail_digitize_publishing += raw_dvd + soft_ssh;\n" +
    "    var phreakingPort = printer;\n" +
    "    if (streaming) {\n" +
    "        videoBar += ansiPlay;\n" +
    "    } else {\n" +
    "        cell_dac_cpc(cdRoom, 4, bankPretestUser(definitionLan, pagePseudocode,\n" +
    "                video_virtualization));\n" +
    "        losslessTargetProtector(4, 48, ide + 93);\n" +
    "    }\n" +
    "\n" +
    "Sanguine in comae. Cubat summa, ipse ferarum rugae mens ductum abiit esse\n" +
    "terruit! Frena spatium rogat gaudia acrior, audet nam sua! Herbarum prospexit\n" +
    "**vota**, enim quae concidere nomen invenerit, humi? Obversus **non antro\n" +
    "sidera** diriguit ereptamque *mater* de haec intrare erubui ardeat deas tetigere\n" +
    "iuvenis.\n" +
    "\n" +
    "Axis tibi pellens mihi veretur mitissima fugit, huc victa [vipereos\n" +
    "rege](http://patetin.org/quaerit.html) iniqui foedumque conversa; sorores. Maera\n" +
    "et testes sic, nec [vulnus](http://www.aestumfraude.io/), fortissimus ieiunia,\n" +
    "facto causa! Aevo quae ab fecit stamina, moderatius mirabile vatibus orbem\n" +
    "Gratia contrahitur dempsisse.",
  programmingLanguageId: 1,
  softwarePackages: [
    {
      id: "new1",
      name: "name",
      description: "description",
      documentationUrl: "https://jaspervdj.be/lorem-markdownum/",
      codeRepositoryUrl: "https://jaspervdj.be/lorem-markdownum/",
      programmingLanguageId: 1,
    },
    {
      id: "new2",
      name: "name",
      description: "description",
      documentationUrl: "https://jaspervdj.be/lorem-markdownum/",
      codeRepositoryUrl: "https://jaspervdj.be/lorem-markdownum/",
      programmingLanguageId: 1,
    },
  ],
  variables: [
    {
      id: "new1",
      name: "name",
      description: "description",
    },
    {
      id: "new2",
      name: "name",
      description: "description",
    },
  ],
  codeRepositoryUrl: "https://jaspervdj.be/lorem-markdownum/",
  dataUrl: "https://jaspervdj.be/lorem-markdownum/",
  publicationDOI: "10.1108/JMP-01-2017-0016",
};

export const createPublicationDetailsSlice: StateCreator<
  PublicationDetailsSlice
> = (set) => ({
  publicationDetails: initialState,
  setPublicationDetails: (data) =>
    set((state) => ({
      publicationDetails: { ...state.publicationDetails, ...data },
    })),
});

export type { PublicationDetails, PublicationDetailsSlice };
