import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

const url = "http://localhost:5000";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            randomWikiArticle: props.randomWikiArticle,
            loadingArticle: false
        }
    }

    componentDidMount() {
        document.documentElement.lang = 'es-AR'
        this.setState({randomWikiArticle: this.props.randomWikiArticle})
    }

    handleClick = async e => {
        e.preventDefault();
        this.setLoadingArticleState(true);
        let newRandomArticle = await getRandomArticle();
        this.setState(
            {randomWikiArticle: newRandomArticle},
            () => this.setLoadingArticleState(false))
    };

    setLoadingArticleState(booleanState) {
        this.setState({
            ...this.state,
            loadingArticle: booleanState
        });
    }

    render() {
        const {randomWikiArticle, loadingArticle} = this.state;
        return (
            <div className={styles.container}>
                <Head>
                    <title>Random Wiki article</title>
                    <link rel="icon" href="/favicon.ico"/>
                    <meta name="Description"
                          content="Esta página provee links a artículos aleatorios de Wikipedia.org"/>
                </Head>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Artículo de Wikipedia aleatorio
                    </h1>
                    <div className={styles.grid}>
                        <a href={randomWikiArticle.link} className={styles.card}>
                            <h2>{randomWikiArticle.title}</h2>
                            <p id="preview" className="preview-text">{randomWikiArticle.firstParagraph}</p>
                        </a>
                    </div>
                    <div className={styles.grid}>
                        {loadingArticle ? (
                            <p>Cargando...</p>
                        ) : (
                            <button className={styles.card} onClick={this.handleClick} type="button">Otro
                                artículo</button>
                        )}
                    </div>
                </main>
                <footer className={styles.footer}>
                    Autor: <a className="link" href="https://www.linkedin.com/in/andres-gardiol/">Andrés Gardiol</a>
                </footer>
            </div>
        )
    }
}

export async function getStaticProps() {
    const randomWikiArticle = await getRandomArticle();

    return {props: {randomWikiArticle}};
}

async function getRandomArticle() {
    let responsePromise = fetch(url);
    return await responsePromise
        .then(result => result.json());
}

export default Home
