# Add, rename, and reset saved-item display names

**Source:** documentation I authored for Raster's subscription service. This anonymized adaptation draws on its frontend integration guide.

**Reader:** a frontend engineer integrating a backend feature.

**Scope:** a behavior reference adapted from an integration guide I authored and maintained with AI assistance. It explains the edit form's rename, reset, and no-change semantics. Product nouns are generalized; private routes, request schemas, exact limits, and quota rules are omitted. This excerpt is not a complete API tutorial. Preparation added a source-checked clarification of omitted and empty values.

## Keep the name separate from the identifier

Users can set custom display names for their saved items. Names are **per-user**: different users can name the same item differently.

Show the display name as the primary label and the item identifier as a secondary, truncated label. Renaming changes the user's label; it does not change which saved item the label refers to.

## Distinguish rename, reset, and no change

An optional name has different consequences when adding an item and updating an existing one. Omitting it during an update does not reset the name.

| Operation and name value | Result |
| --- | --- |
| Add an item; omit the custom name | Use the item identifier as the display label |
| Update an item; supply a custom string within the supported length | Replace the user's display name |
| Update an item; omit the name | Leave the existing name unchanged |
| Update an item; explicitly supply `null` | Clear the custom name; the displayed label returns to the item identifier |
| Update an item; supply `""` | In the reviewed implementation, store an empty string; this does **not** request a reset |

Provide a separate **Reset to identifier** control that sends `null`. An empty editor value and an explicit reset must not be treated as interchangeable requests. The reset action clears the custom name; it does not remove the saved item.

## Apply the behavior in an edit form

1. **Add the item.** Include a custom name if the user supplies one. Otherwise, omit the name so the identifier becomes the label.
2. **Read the saved-item list.** Display the returned label, with the identifier shown separately. Different accounts can receive different labels for the same item.
3. **Rename the item.** Use an inline editor or a modal. Check the supported maximum length before submitting the new string. After the update, read the list to confirm the new label.
4. **Reset the name.** Submit an explicit `null` through the reset control. Read the list again: the display label should now be the item identifier.

The distinction in step 4 matters when a form serializer drops empty fields. A request with no name value leaves the existing name in place; resetting requires the explicit `null` value.

## Handle validation separately from reset

| Condition | What the frontend needs to handle |
| --- | --- |
| Name exceeds the supported maximum length | Prompt the user to shorten the name before submitting |
| Item identifier is missing | Include the identifier for the saved item being edited |
| Item is not saved by the current user | Treat the update as unsuccessful; do not display a successful rename |

The exact length limit and HTTP error contract are outside this excerpt. The distinction to preserve in the form is that validation failure, an omitted value, and an explicit reset are three different states.

## Validation

Preparation checked the retained behavior against the original guide, request validation, the update and list implementation, and existing unit-test assertions. The omitted-value and empty-string clarification comes from source inspection; it is not a claim that the original guide already explained those cases. No private service or database was executed.

### Source-review limit

The behavior table describes the inspected code path. Historical storage formats were not exercised; this review does not establish migration coverage.
