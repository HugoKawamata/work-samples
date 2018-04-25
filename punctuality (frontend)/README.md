Punctuality
=================================

Hi Tanda!

## Setup
Run the `punctuality.rb` server as normal, then:

In `/punctuality (frontend)/punctuality`, run `yarn` to install all the npm packages I used.
Then, in the same directory, run `yarn start` to compile the development build.

## New Feature - Download paperwork
As per the spec, I've implemented an original feature. The download paperwork button
will download a `.tex` file containing the roster information to the user's computer.

To build the `.tex` file to a pdf, you can run `pdflatex [filename]` if you have latex
installed on your computer, or you can use `https://cloudconvert.com/tex-to-pdf`.