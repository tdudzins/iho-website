var descriptionPane =
    `<div id="save-edit-container" class="save-edit-container">
		<input id="editsaveButton" class="editsaveButton" value="Edit" type="submit">
	</div>

    <div id="description-pane" class="description-pane">

        <div id="adaptation-name-div" class="adaptation-name-div">
            <div id="adaptation-name-label" class="adaptation-name-label">
                <label class="description-labels"> Adaptation Name: </label>
            </div>
            <div id="adaptation-name-field" class="adaptation-name-field">
                <input id="adaptationName" class="description-text" type="text">
            </div>
        </div>

        <div id="adaptation-de-div" class="adaptation-de-div">
            <div id="adaptation-de-label" class="adaptation-de-label">
                <label class="description-labels"> Earliest Direct Evidence: </label>
            </div>
            <div id="adaptation-de-field" class="adaptation-de-field">
                <input id="earliestDirectEvidence" class="description-text" type="text">
                <select id="earliestDirectEvidence-units" class="units-combobox">
                    <option value="Ma">Ma</option>
                    <option value="Ka">Ka</option>
                </select>
            </div>
        </div>

        <div id="adaptation-ie-div" class="adaptation-ie-div">
            <div id="adaptation-ie-label" class="adaptation-ie-label">
                <label class="description-labels"> Earliest Indirect Evidence: </label>
            </div>
            <div id="adaptation-ie-field" class="adaptation-ie-field">
                <input id="earliestIndirectEvidence" class="description-text" type="text">
                <select id="earliestIndirectEvidence-units" class="units-combobox">
                    <option value="Ma">Ma</option>
                    <option value="Ka">Ka</option>
                </select>
            </div>
        </div>


        <div id="boundary-start-div" class="boundary-start-div">
            <div id="boundary-start-label" class="boundary-start-label">
                <label class="description-labels"> Age Boundary Start: </label>
            </div>
            <div id="boundary-start-field" class="boundary-start-field">
                <input id="ageBoundaryStart" class="description-text" type="text">
                <select id="ageBoundaryStart-units" class="units-combobox">
                    <option value="Ma">Ma</option>
                    <option value="Ka">Ka</option>
                </select>
            </div>
        </div>

        <div id="boundary-end-div" class="boundary-end-div">
            <div id="boundary-end-label" class="boundary-end-label">
                <label class="description-labels"> Age Boundary End: </label>
            </div>
            <div id="boundary-end-field" class="boundary-end-field">
                <input id="ageBoundaryEnd" class="description-text" type="text">
                <select id="ageBoundaryEnd-units" class="units-combobox">
                    <option value="Ma">Ma</option>
                    <option value="Ka">Ka</option>
                </select>
            </div>
        </div>

        <div id="adaptation-category-div" class="adaptation-category-div">
            <div id="adaptation-category-label" class="adaptation-category-label">
                <label class="description-labels"> Category: </label>
            </div>
            <div id="adaptation-category-field" class="adaptation-category-field">
                <select id="adaptation-category-combo" class="adaptation-category-combo">
                </select>
            </div>
        </div>

        <div id="adaptation-description-div" class="adaptation-description-div">
            <div id="adaptation-description-label" class="adaptation-description-label">
                <label class="description-labels"> Adaptation Description: </label>
            </div>
            <div id="adaptation-description-field" class="adaptation-description-field">
                <textarea id="adaptationDescription" class="adaptationDescription"></textarea>
            </div>
        </div>

        <div id="adaptation-references-div" class="adaptation-references-div">
            <div id="adaptation-references-label" class="adaptation-references-label">
                <label class="description-labels"> References: </label>
            </div>
            <div id="adaptation-references-field" class="adaptation-references-field">
                <textarea id="adaptationReferences" class="adaptationReferences"></textarea>
            </div>
        </div>

        <div id="adaptation-comments-div" class="adaptation-comments-div">
            <div id="adaptation-comments-label" class="adaptation-comments-label">
                <label class="description-labels"> Comments: </label>
            </div>
            <div id="adaptation-comments-field" class="adaptation-comments-field">
                <textarea id="adaptationComments" class="adaptationComments"></textarea>
            </div>
        </div>

    </div>`;

var mediaPane =
    `<div id="save-edit-container" class="save-edit-container">
		<input id="editsaveButton" class="editsaveButton" value="Edit" type="submit">
	</div>

    <div id="media-pane" class="media-pane">
        <div id="adaptation-media-list" class="adaptation-media-list">
            <div id="media-list-header" class="media-list-header">
                <label id="media-list-label" class="media-list-label">Media List</label>
            </div>
            <div id="media-collection" class="media-collection">
                <ul id="media-items" class="media-items">
                </ul>
            </div>
            <div id="media-buttons" class="media-buttons">
                <div id="addMedia" class="addMedia">
                    <input id="addMediaButton" class="addMediaButton" type="submit" value="Add Media">
                </div>
                <div id="removeMedia" class="removeMedia">
                    <input id="removeMediaButton" class="removeMediaButton" type="submit" value="Remove Media">
                </div>
            </div>
        </div>
        <div id="adaptation-media-info>" class="adaptation-media-info">
            <div id="media-description-div" class="media-description-div">
                <div id="media-description-label" class="media-description-label">
                    <label class="description-labels"> Media Description: </label>
                </div>
                <div id="media-description-field" class="media-description-field">
                    <textarea id="mediaDescription" class="mediaDescription"></textarea>
                </div>
            </div>
            <div id="media-type-div" class="media-type-div">
                <div id="media-type-label" class="media-type-label">
                    <label class="description-labels"> Media Type </label>
                </div>
                <div id="media-type-field" class="media-type-field">
                    <select id="media-type-combo" class="media-type-combo">
                        <option value="0" id="upload-default" class="upload-default">Select one of the following media types...</option>
                        <option value="1" id="upload-picture" class="upload-picture">Upload Picture</option>
                        <option value="2" id="embedded-picture" class="embedded-picture">Embedded Picture</option>
                        <option value="3" id="embedded-video" class="embedded-video">Embedded Video</option>
                        <option value="4" id="other-option" class="other-option">Other</option>
                    </select>
                </div>
            </div>

            <div id="embedded-link-div" class="embedded-link-div">
                <div id="embedded-link-label" class="embedded-link-label">
                    <label class="description-labels"> Embedded Link: </label>
                </div>
                <div id="embedded-link-field" class="embedded-link-field">
                    <input id="embedded-link" class="embedded-link" type="text">
                </div>
            </div>

            <div id="upload-file-div" class="upload-file-div">
                <div id="upload-file-label" class="upload-file-label">
                    <label class="description-labels"> Upload File: </label>
                </div>
                <div id="upload-file-field" class="upload-file-field">
                    <input id="upload-file" class="upload-file" type="file">
                </div>
                
            </div>
        </div>
    </div>`;

var relationsPane =
    `<div id="save-edit-container" class="save-edit-container">
		  <input id="editsaveButton" class="editsaveButton" value="Edit" type="submit">
  	</div>
    <div id="relations-pane" class="relations-pane">
      <div id="all-adapts-pane" class="all-adapts-pane">
        <div id="relations-header" class="relations-header">
          <label class="description-labels"> All Adaptations </label>
        </div>
        <div id="relations-sorting" class="relations-sorting">
          <input id="relations-searchbar-text" class="relations-searchbar-text" type="text" placeholder="Search for an adaptation..." >
          <input id="relations-searchbutton" class="relations-searchbutton" type="submit" value="Go">
        </div>
        <div id="relations-database-collection" class="relations-database-collection">
          <ul id="relations-items" class="relations-items">
          </ul>
        </div>
      </div>
      <div id="stacked-pane" class="stacked-pane">
        <div id="relations-buttons-pane" class="relations-buttons-pane">
          <input id="add-to-preconditions" class="add-to-preconditions" type="button" value="Add To Preconditions">
          <input id="add-to-relationships" class="add-to-relationships" type="button" value="Add To Relationships">
          <input id="remove-from-list" class="remove-from-list" type="button" value="Remove">
        </div>
        <div id="relations-div-pane" class="relations-div-pane">
          <div id="preconditions-div" class="preconditions-div">
              <div id="preconditions-header" class="preconditions-header">
                <label class="description-labels"> Preconditions </label>
              </div>
              <div id="preconditions-database-collection" class="preconditions-database-collection">
                <ul id="preconditions-items" class="preconditions-items">
                </ul>
              </div>
            </div>
            <div id="relationships-div" class="relationships-div">
              <div id="relationships-header" class="relationships-header">
                <label class="description-labels"> Relationships </label>
              </div>
              <div id="relationships-database-collection" class="relationships-database-collection">
                <ul id="relationships-items" class="relationships-items">
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>`;

var categoryPane =
  `<div id="save-edit-container" class="save-edit-container">
    <input id="editsaveButton" class="editsaveButton" value="Edit" type="submit">
  </div>

  <div id="category-pane" class="category-pane">
      <div id="category-list" class="category-list">
          <div id="category-list-header" class="category-list-header">
              <label id="category-list-label" class="category-list-label">Category List</label>
          </div>
          <div id="category-collection" class="category-collection">
              <ul id="category-items" class="category-items">
              </ul>
          </div>
          <div id="category-buttons" class="category-buttons">
              <div id="addCategory" class="addCategory">
                  <input id="addCategoryButton" class="addCategoryButton" type="submit" value="Add Category">
              </div>
              <div id="removeCategory" class="removeCategory">
                  <input id="removeCategoryButton" class="removeCategoryButton" type="submit" value="Remove Category">
              </div>
          </div>
      </div>
      <div id="category-info>" class="category-info">

          <div id="category-div" class="category-div">
              <div id="category-label" class="category-label">
                  <label class="category-labels"> Category Name: </label>
              </div>
              <div id="category-field" class="category-field">
                  <input id="category" class="category" type="text">
                  <input id="updateCategoryButton" value="Update" type="button">
              </div>
          </div>
      </div>
  </div>`;

var firstLoadPane =
	`<div id="save-edit-container" class="save-edit-container">
		<input id="editsaveButton" class="editsaveButton" value="Edit" type="submit" hidden>
	</div>

    <div id="first-load-pane" class="first-load-pane">

		<div id="select-an-adaptation-div" class="select-an-adaptation-div">
			<label id="select-an-adaptation-label" class="select-an-adaptation-label"> Please create an adaptation or select an adaptation <br> from the list on the left. </label>
		</div>
	</div>`;

var cancelButton = '<input id="cancelButton" class="editsaveButton" value="Cancel" type="submit">';
