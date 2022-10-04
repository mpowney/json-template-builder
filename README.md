# JSON Templates Builder for SharePoint

This is a [Create React App](https://github.com/facebook/create-react-app) based repo.

This app provides a pure client-side solution to building **List layout customisations** for SharePoint's modern Lists UI.  The React app is deployed to a static site.  Users who access the app have all data persisted in the user's local storage.

Users are provided an HTML editor.  The app analyses the entered HTML, and if valid, produces the JSON needed for a SharePoint List layout template, based on the row or column schema.

A preview is generated based on the entered HTML.  This preview has basic styling applied to make it look how it will render in SharePoint's list views.

## Learn more

Find out more about [SharePoint's **List layout customisations** here](https://learn.microsoft.com/sharepoint/dev/declarative-customization/view-list-formatting).

Check out the public repo of [**List Formatting samples**, maintained by the PnP community, here](https://github.com/pnp/List-Formatting).  &#35;SharingIsCaring.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Future ideas

The app in its current form is very rudimentry.  The following ideas will help develop this into a more robust and globally usable solution:

* Copy to clipboard button for JSON output
* Highlight code as invalid in the HTML editor, if it is not supported in a List layout customization (e.g. class names not available in the SharePoint platform, style attributes not supported by the schemas)
* Support for inline functions, and operators
* Smart previewing for operators logic
* Ability to enter import JSON template and reverse-engineer it in to working HTML
* Ability to enter a set of field names sourced from the SharePoint environment
* Highlight code as invalid in the HTML editor, if the code references fields that aren't specified / valid
* Ability to enter sample data, to be used in the preview window
* Authenticate to a SharePoint Online environment (using an Azure Active Directory global app), and:
    * Select a target site and list, to obtain sample fields and sample data
    * Deploy the generated JSON template to a target site / list / view
* Options for saving multiple JSON template 'working copies':
    * To the browser's local storage
    * To OneDrive
    * To a SharePoint document library

## Development

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
