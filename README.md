# URL Passthrough

The URL Passthrough data connectors allow you to move the implementation of
your connector out of a Google Apps Script project and into an external
environment. This is especially useful for accessing data in environments that
require heavyweight libraries to access data, like AWS, Azure, and Firebase,
just to name a few.

The URL Passthrough connectors delegate the standard Google Data Studio
connector callbacks to external URLs that you configure when you connect to a
report. Be sure to choose the URL Passthrough variation with the appropriate
authentication model.

**Website**: [https://wedodatastuff.com/url-passthrough][0]  
**Source Code**: [https://github.com/wedodatastuff/url-passthrough-no-auth][1]

## Usage

Prerequisites: You need to have a [Google Data Studio][2] account and be
familiar with how add a connector to a report.

1. Create or open a report in Google Data Studio.
1. Add a connector to the report. Search the community gallery for "URL
   Passthrough". Be sure to select the variation with the appropriate
   authentication model.
1. When prompted, fill in the necessary URLs hosted in your environment.
1. Create beautiful visualizations.

## Support

Do you have an issue or a request? [Create a GitHub issue][3] or send an email
to support@wedodatastuff.com.

## Contributing

This community connector is maintained by [We Do Data Stuff][0]. If you would
like to help out, please start by creating a GitHub issue that describes the
fix or improvement. We look forward to hearing from you!

[0]: https://wedodatastuff.com/url-passthrough
[1]: https://github.com/wedodatastuff/url-passthrough-no-auth
[2]: https://datastudio.google.com
[3]: https://github.com/wedodatastuff/url-passthrough-no-auth/issues
