export const latexTemplate = (student) => String.raw`
\documentclass[a4paper]{article}
\usepackage[margin=1cm]{geometry}
\usepackage{array}
\usepackage{xcolor}
\usepackage{colortbl}
\usepackage{graphicx}
\usepackage{catchfile}

% Add these packages for URL image support
\usepackage{catchfile}
\usepackage{currfile}
\usepackage{ifthen}

\newcommand{\sectiontitle}[1]{\textbf{\large #1}}
\newcommand{\fieldname}[1]{\textbf{#1:}}
\newcommand{\fieldvalue}[1]{\texttt{#1}}

\begin{document}

\begin{center}
    \texttt{\Large\textbf{Student Details}}
    
 \vspace{0.5cm}
% Assuming the file is saved locally as 'student_photo.jpg'
\includegraphics[width=0.3\textwidth]{temp/student-passport-photo.jpg}

    \vspace{0.5cm}
    \texttt{\large\textbf{${student.name}}}
\end{center}

\vspace{1cm}

\noindent
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Personal Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Basic Details}} \\
        \fieldname{Name} & \fieldvalue{${student.name}} \\
        \fieldname{Roll Number} & \fieldvalue{${student.rollNo}} \\
        \fieldname{Class, Branch, Section} & \fieldvalue{${student.classBranchSection}} \\
        \fieldname{Year of Study} & \fieldvalue{${student.yearOfStudy}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Father's Details}} \\
        \fieldname{Name} & \fieldvalue{${student.fatherName}} \\
        \fieldname{Occupation} & \fieldvalue{${student.fatherOccupation}} \\
        \fieldname{Mobile} & \fieldvalue{${student.fatherMobile}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Mother's Details}} \\
        \fieldname{Name} & \fieldvalue{${student.motherName}} \\
        \fieldname{Occupation} & \fieldvalue{${student.motherOccupation}} \\
        \fieldname{Mobile} & \fieldvalue{${student.motherMobile}} \\
    \end{tabular}
\end{minipage}
\hfill
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Contact Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Residential Address}} \\
        \fieldname{Address Line 1} & \fieldvalue{${student.residentialAddress1}} \\
        \fieldname{Line 2} & \fieldvalue{${student.residentialAddress2}} \\
        \fieldname{Line 3} & \fieldvalue{${student.residentialAddress3}} \\
        \fieldname{City} & \fieldvalue{${student.residentialCity}} \\
        \fieldname{State} & \fieldvalue{${student.residentialState}} \\
        \fieldname{Pincode} & \fieldvalue{${student.residentialPincode}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Student Contact}} \\
        \fieldname{Email} & \fieldvalue{${student.studentEmail}} \\
        \fieldname{Mobile} & \fieldvalue{${student.studentMobile}} \\
    \end{tabular}
\end{minipage}

\vspace{1cm}

\noindent
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Additional Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Siblings}} \\
        \fieldname{Siblings} & \fieldvalue{${student.siblings}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Health Information}} \\
        \fieldname{Blood Group} & \fieldvalue{${student.bloodGroup}} \\
        \fieldname{Allergies} & \fieldvalue{${student.allergies}} \\
        \fieldname{Health Problems} & \fieldvalue{${student.healthProblems}} \\
    \end{tabular}
\end{minipage}
\hfill
\begin{minipage}[t]{0.48\textwidth}
    \sectiontitle{Local Guardian Information}
    \begin{tabular}{@{} >{\raggedright\arraybackslash}p{0.4\linewidth} p{0.6\linewidth} @{}}
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Guardian Details}} \\
        \fieldname{Name} & \fieldvalue{${student.localGuardianName}} \\
        \fieldname{Mobile} & \fieldvalue{${student.localGuardianMobile}} \\
        \fieldname{Relationship} & \fieldvalue{${student.localGuardianRelationship}} \\
        \rowcolor[gray]{0.9} \multicolumn{2}{l}{\textbf{Guardian Address}} \\
        \fieldname{Line 1} & \fieldvalue{${student.localGuardianAddress1}} \\
        \fieldname{Line 2} & \fieldvalue{${student.localGuardianAddress2}} \\
        \fieldname{Line 3} & \fieldvalue{${student.localGuardianAddress3}} \\
        \fieldname{City} & \fieldvalue{${student.localGuardianCity}} \\
        \fieldname{State} & \fieldvalue{${student.localGuardianState}} \\
        \fieldname{Pincode} & \fieldvalue{${student.localGuardianPincode}} \\
    \end{tabular}
\end{minipage}

\end{document}
`;
