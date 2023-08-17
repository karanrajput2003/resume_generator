function generatepdf(){
    console.log("call");
    const element = document.getElementById("container");
    var opt = {
        margin:       0,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, logging: true, letterRender:true, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy']}
      };
    html2pdf().set(opt).from(element).toPdf().save();

}

