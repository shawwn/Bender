const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const os = require('os');
const fs = require('fs');
const Discord = require("discord.js");

const latexCode = v => (
`\\documentclass[border=1pt]{standalone}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{mathtools}
\\usepackage{color}
\\begin{document}
${v}
\\end{document}`
);

const latex = async function(code){
  //console.log(code);
  const tmpdir = os.tmpdir();
  const fileStem = tmpdir + "\\" + Math.random().toString(36);
  const texFile = fileStem + ".tex";
  await new Promise(res => fs.writeFile(texFile, latexCode(code), 'utf8', res));
  try {
    await execFile('pdflatex -halt-on-error', [texFile], {
      shell: true,
      cwd: tmpdir
    });
    await execFile('gswin64c -dGraphicsAlphaBits=4 -dTextAlphaBits=4 -r300 -sDEVICE=pngalpha', [`-o ${fileStem}.png`, `${fileStem}.pdf`], {
      shell: true,
      cwd: tmpdir
    });
    await this.channel.send(`*${this.member}*`, new Discord.Attachment(`${fileStem}.png`));
  } catch (e){
    const errors = e.stdout.match(/No file .+?\.aux\.\s+([^]+?)!  ==> Fatal error occurred/)[1];
    await this.channel.send(`*${this.member}* Error, see below:\n${errors}`);
  }
};

latex.RAW = true;

exports[""] = latex;