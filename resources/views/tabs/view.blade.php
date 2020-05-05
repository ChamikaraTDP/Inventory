<div class="columns is-centered">
    <div class="column is-8 box">
        <div class="field">
            <p class="control has-icons-left">
                <input class="input" type="text" placeholder="Search">
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
            <transactions v-bind:trans="trans"></transactions>
        </div>
    </div>
</div>

{{--<div>
    <article class="media">
        <div class="media-left">
            <span class="tag is-large is-link is-rounded"><span class="icon">R</span></span>
        </div>
        <div class="media-content">
            <nav style="margin-bottom: 1rem" class="level">
                <div class="level-left">
                            <span class="level-item">
                                <span class="tag is-white is-medium">Transaction ID :</span>
                            </span>
                    <span class="level-item">
                                <span class="tag is-medium is-rounded">00983842</span>
                            </span>
                </div>
                <div class="level-right">
                            <span class="level-item">
                                <span class="tags are-medium has-addons">
                                    <span class="tag">Received On :</span>
                                    <span class="tag is-primary">12/01/2018</span>
                                </span>
                            </span>
                </div>
            </nav>
            <div class="content">
                <div class="tags are-medium">
                    <span class="tag is-white">Received From :</span>
                    <span class="tag is-info is-rounded">Accounts Branch</span>
                </div>
            </div>
        </div>
        <div class="media-right">
            <button class="button is-medium">
                        <span class="icon">
                            <i class="fas fa-eye"></i>
                        </span>
            </button>
        </div>
    </article>

    <article class="media">
        <div class="media-left">
            <span class="tag is-large is-warning is-rounded"><span class="icon">I</span></span>
        </div>
        <div class="media-content">
            <nav style="margin-bottom: 1rem" class="level">
                <div class="level-left">
                            <span class="level-item">
                                <span class="tag is-white is-medium">Transaction ID :</span>
                            </span>
                    <span class="level-item">
                                <span class="tag is-medium is-rounded">10386842</span>
                            </span>
                </div>
                <div class="level-right">
                            <span class="level-item">
                                <span class="tags are-medium has-addons">
                                    <span class="tag">Issued On :</span>
                                    <span class="tag is-primary">22/03/2019</span>
                                </span>
                            </span>
                </div>
            </nav>
            <div class="content">
                <div class="tags are-medium">
                    <span class="tag is-white">Issued To :</span>
                    <span class="tag is-info is-rounded">VMS Branch</span>
                </div>
            </div>
        </div>
        <div class="media-right">
            <button class="button is-medium">
                        <span class="icon">
                            <i class="fas fa-eye"></i>
                        </span>
            </button>
        </div>
    </article>
</div>--}}



