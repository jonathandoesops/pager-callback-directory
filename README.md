# Pager Callback Directory

A mobile-friendly callback dialer based on [`propski/nuimphonebook`](https://github.com/propski/nuimphonebook), with separate modes for Northwestern Memorial Hospital, Jesse Brown VA Medical Center, and Lurie Children’s Hospital.

## Callback mappings

- NMH: `2-XXXX`, `4-XXXX`, `5-XXXX`, and `6-XXXX`
- VA: `4-XXXX` and `5-XXXX`
- Lurie: `7-XXXX` → `312-227-XXXX`

Select the hospital, enter the five-digit callback number on the dial pad, and tap **Call**.

## GitHub Pages

The site is deployed automatically from `main` using the workflow in `.github/workflows/pages.yml`.

Before clinical use, verify every callback mapping against the current directory supplied by the applicable hospital.
