export default {
  slug: 'batch-installer',
  title: 'Installation Batch File',
  order: 7,
  description: 'My dad works at Infineon Technologies AG, and he kept running into the same problem with his team: every time someone got a new workstation, they had to manually download and run through the setup for multiple programs and Python libraries before they could use a voltage regulator test suite. He asked me if I could make that easier, so I built a Windows batch script to handle the whole chain from a single run.\n\nThe original goal was to make it so that an employee would only need to download the batch file itself, and then it would pull the exact installer versions needed directly from Infineon\'s internal storage and run them automatically. Because Infineon keeps everything behind their own firewall and internal data storage that only employees can access, I had to work within those restrictions while developing remotely through a VPN on my dad\'s business laptop. After several rounds of testing I found that batch scripting was too limited to work around the firewall constraints on its own, so I had to settle on a workaround: the employee downloads the installer executables alongside the batch file, and then the script handles running them all in the correct order.\n\nThe source isn\'t public because it contains company-specific tooling details. The whole project took about three to four hours of web research and iterative testing, without AI assistance.',
  tools: ['Batch', 'Python'],
  github: null,
  files: [],
  media: null,
}
