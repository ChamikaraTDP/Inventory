<div class="columns is-centered">
    <div style="border: 1px solid #dbdbdb" class="column is-8 box">
        <div class="field">
            <p class="control has-icons-left">
                <input id="search_box" class="input" type="text" placeholder="Search">
                <span class="icon is-left">
                    <i class="fas fa-search" aria-hidden="true"></i>
                </span>
            </p>
        </div>
        <div class="tabs is-toggle is-centered is-fullwidth">
            <ul id="tran_tabs">
                <li class="is-active"><a>All</a></li>
                <li><a>Receipts</a></li>
                <li><a>Issues</a></li>
            </ul>
        </div>
        <div id="app_view">
            <transactions :trans="trans" :u_stn="u_stn"></transactions>
        </div>
    </div>
</div>

<div id="isu_mdl" class="model"></div>
