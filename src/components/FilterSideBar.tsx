import React from "react";

function FilterSideBar() {
  return (
    <aside>
      <form action="">
        <input type="range" name="price-range" id="price-range" />
        <div>
          <h4>Sizes</h4>
          <label>
            S
            <input type="checkbox" name="sizeS" id="sizeS" />
          </label>
          <label>
            M
            <input type="checkbox" name="sizeM" id="sizeM" />
          </label>
          <label>
            L
            <input type="checkbox" name="sizeL" id="sizeL" />
          </label>
        </div>
      </form>
    </aside>
  );
}

export default FilterSideBar;
