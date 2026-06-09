import React, { useState } from 'react';
import {
    AccordeonCell,
    ActionFormCell,
    Avatar,
    Checkbox,
    ContextMenu,
    Dropdown,
    FeedbackBanner,
    FormCell,
    Input,
    PageAction,
    Radio,
    NavigationBar,
    MainPageNavigationBar,
    Spinner,
    Switch,
    TextArea,
    Tooltip,
    Widget,
    WidgetTitleAccessory,
    Footer,
} from '../../src';
import {
    AppIconTSquare,
    Bell,
    Circle,
    DotsThreeHorizontal,
    LayerOnLayerRectangleVertical,
    Pencil,
    Trash,
} from '../../src/icons';
import type { FooterLayout } from '../../src';

export const ComponentsPreview: React.FC = () => {
    const [baseTextAreaValue, setBaseTextAreaValue] = useState('');
    const [descriptionTextAreaValue, setDescriptionTextAreaValue] = useState('');
    const [errorTextAreaValue, setErrorTextAreaValue] = useState('');
    const [singleSwitchSelected, setSingleSwitchSelected] = useState(true);
    const [singleCheckboxSelected, setSingleCheckboxSelected] = useState(true);
    const [singleRadioSelected, setSingleRadioSelected] = useState(true);
    const [groupSwitchStates, setGroupSwitchStates] = useState([true, false, true]);
    const [groupCheckboxStates, setGroupCheckboxStates] = useState([true, false, true]);
    const [groupRadioSelectedIndex, setGroupRadioSelectedIndex] = useState(0);
    const [actionFormCellClickCount, setActionFormCellClickCount] = useState(0);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuPlacement, setContextMenuPlacement] = useState<'right' | 'left'>('right');
    const [tooltipPlacement, setTooltipPlacement] = useState<'right' | 'left'>('right');
    const [isTooltipLongText, setIsTooltipLongText] = useState(false);
    const [isWidgetDescriptionVisible, setIsWidgetDescriptionVisible] = useState(true);
    const [isWidgetChevronVisible, setIsWidgetChevronVisible] = useState(true);
    const [isFeedbackBannerSecondaryVisible, setIsFeedbackBannerSecondaryVisible] = useState(true);
    const [isFooterDescriptionVisible, setIsFooterDescriptionVisible] = useState(true);
    const [footerLayout, setFooterLayout] = useState<FooterLayout>('3-buttons');
    const [widgetAccessoryVariant, setWidgetAccessoryVariant] = useState<'icon' | 'link' | 'link-icon' | 'icon-icon' | 'description' | 'editing-mode' | 'none'>('icon');
    const demoIcon = <Circle />;

    const accessoryIcon24 = (
        <span className="ds-icon ds-icon--m" aria-hidden="true">
            {demoIcon}
        </span>
    );

    const accessoryIcon30 = (
        <span className="ds-icon ds-icon--30" aria-hidden="true">
            {demoIcon}
        </span>
    );

    const accessoryAvatarS = (
        <Avatar
            size="s"
            shape="circle"
            style={{ '--avatar-surface': 'var(--bg-neutral-1)', '--avatar-color': 'var(--primitive-secondary)' } as React.CSSProperties}
            icon={demoIcon}
        />
    );

    const formCellLeftAccessory = (
        <Avatar
            size="s"
            shape="circle"
            style={{ '--avatar-surface': 'var(--bg-neutral-1)', '--avatar-color': 'var(--primitive-secondary)' } as React.CSSProperties}
            icon={demoIcon}
        />
    );

    const actionFormCellLeftAccessory = (
        <span className="ds-icon ds-icon--m" aria-hidden="true">
            {demoIcon}
        </span>
    );

    const actionFormCellLoader = <Spinner className="action-form-cell__spinner" />;
    const handleActionFormCellClick = () => {
        setActionFormCellClickCount((count) => count + 1);
    };

    const toggleGroupSwitch = (index: number, nextValue: boolean) => {
        setGroupSwitchStates((current) => current.map((value, currentIndex) => (
            currentIndex === index ? nextValue : value
        )));
    };

    const toggleGroupCheckbox = (index: number, nextValue: boolean) => {
        setGroupCheckboxStates((current) => current.map((value, currentIndex) => (
            currentIndex === index ? nextValue : value
        )));
    };

    const contextMenuItems = [
        {
            key: 'edit',
            label: 'Редактировать',
            icon: <Pencil />,
            variant: 'default' as const,
            onClick: () => setIsContextMenuOpen(false),
        },
        {
            key: 'duplicate',
            label: 'Дублировать',
            icon: <LayerOnLayerRectangleVertical />,
            variant: 'default' as const,
            onClick: () => setIsContextMenuOpen(false),
        },
        {
            key: 'delete',
            label: 'Удалить',
            icon: <Trash />,
            variant: 'danger' as const,
            onClick: () => setIsContextMenuOpen(false),
        },
    ];

    const tooltipContent = isTooltipLongText
        ? (
            <>
                <p>Текст S</p>
                <p>Дополнительный абзац помогает проверить перенос строк и вертикальный ритм внутри подсказки.</p>
                <p>Лонгриды лучше не использовать, но несколько абзацев компонент поддерживает без ограничений.</p>
            </>
        )
        : 'Текст S';

    return (
        <div className="tab-panel is-active">
            <section className="component-screen">
                <div className="preview-grid preview-grid--label-120-cols-3-wide">
                    <h1 className="component-screen__title ts-600-2xl">Fields</h1>
                    <div className="preview-grid__header ts-500-m">Input</div>
                    <div className="preview-grid__header ts-500-m">TextArea</div>
                    <div className="preview-grid__header ts-500-m">Dropdown</div>

                    <div className="preview-grid__label ts-500-m">Base</div>
                    <Input label="Label" placeholder="Placeholder" right={accessoryIcon24} />
                    <TextArea
                        label="Label"
                        placeholder="Placeholder"
                        value={baseTextAreaValue}
                        onChange={setBaseTextAreaValue}
                        maxLength={200}
                    />
                    <Dropdown label="Label" options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]} />

                    <div className="preview-grid__label ts-500-m">Description</div>
                    <Input label="Label" placeholder="Placeholder" description="Helper text" right={accessoryIcon30} />
                    <TextArea
                        label="Label"
                        placeholder="Placeholder"
                        description="Helper text"
                        value={descriptionTextAreaValue}
                        onChange={setDescriptionTextAreaValue}
                        maxLength={200}
                    />
                    <Dropdown label="Label" options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]} description="Helper text" />

                    <div className="preview-grid__label ts-500-m">Error</div>
                    <Input label="Label" placeholder="Placeholder" isError errorMessage="Error message" right={accessoryAvatarS} />
                    <TextArea
                        label="Label"
                        placeholder="Placeholder"
                        isError
                        errorMessage="Error message"
                        value={errorTextAreaValue}
                        onChange={setErrorTextAreaValue}
                        maxLength={200}
                    />
                    <Dropdown
                        label="Label"
                        options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]}
                        isError
                        errorMessage="Error message"
                        right={accessoryAvatarS}
                    />

                    <div className="preview-grid__label ts-500-m">Disabled</div>
                    <Input label="Label" placeholder="Placeholder" isDisabled />
                    <TextArea
                        label="Label"
                        placeholder="Placeholder"
                        value={errorTextAreaValue}
                        onChange={setErrorTextAreaValue}
                        maxLength={200}
                        isDisabled
                    />
                    <Dropdown
                        label="Label"
                        options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]}
                        isDisabled
                        right={accessoryAvatarS}
                        hasChevron={false}
                    />

                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--accordeon-cell-demo">
                    <h1 className="component-screen__title ts-600-2xl">Accordeon Cell</h1>
                    <div className="preview-grid__header ts-500-m">XL</div>
                    <div className="preview-grid__header ts-500-m">2XL</div>

                    <div className="preview-grid__label ts-500-m">Title chevron</div>
                    <AccordeonCell title="Текст XL" description="Text S" defaultOpen>
                        <span className="accordeon-cell-preview__item ts-400-m">Контент внутри аккордеона</span>
                        <span className="accordeon-cell-preview__item ts-400-m">List item со своим spacing</span>
                    </AccordeonCell>
                    <AccordeonCell title="Текст 2XL" description="Text S" size="2xl" />

                    <div className="preview-grid__label ts-500-m">Edge chevron</div>
                    <AccordeonCell
                        title="Текст XL"
                        description="Text S"
                        chevronPosition="edge"
                        hasRightAccessory={false}
                    />
                    <AccordeonCell
                        title="Текст 2XL"
                        description="Text S"
                        size="2xl"
                        chevronPosition="edge"
                        hasRightAccessory={false}
                        defaultOpen
                        contentSpacing="2x"
                        listSpacing="1x"
                    >
                        <span className="accordeon-cell-preview__item ts-400-m">Первый элемент</span>
                        <span className="accordeon-cell-preview__item ts-400-m">Второй элемент</span>
                    </AccordeonCell>

                    <div className="preview-grid__label ts-500-m">Options</div>
                    <AccordeonCell
                        title="Без Description"
                        description="Text S"
                        hasDescription={false}
                        rightAccessoryText="Text M"
                    />
                    <AccordeonCell
                        title="Без Right Accessory"
                        description="Text S"
                        size="2xl"
                        hasRightAccessory={false}
                    />
                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--label-120-cols-2-wide">
                    <h1 className="component-screen__title ts-600-2xl">Action Form Cell</h1>
                    <div className="preview-grid__header ts-500-m">Text</div>
                    <div className="preview-grid__header ts-500-m">Text + Description</div>

                    <div className="preview-grid__label ts-500-m">Single</div>
                    <ActionFormCell title="Text" left={actionFormCellLeftAccessory} onClick={handleActionFormCellClick} />
                    <ActionFormCell title="Text" description="Description" left={actionFormCellLeftAccessory} right={actionFormCellLoader} onClick={handleActionFormCellClick} />

                    <div className="preview-grid__label ts-500-m">Group</div>
                    <div className="preview-stack-group">
                        <ActionFormCell title="Text" left={actionFormCellLeftAccessory} variant="stack-top" onClick={handleActionFormCellClick} />
                        <ActionFormCell title="Text" left={actionFormCellLeftAccessory} variant="stack-middle" onClick={handleActionFormCellClick} />
                        <ActionFormCell title="Text" left={actionFormCellLeftAccessory} variant="stack-bottom" onClick={handleActionFormCellClick} />
                    </div>
                    <div className="preview-stack-group">
                        <ActionFormCell title="Text" description="Description" left={actionFormCellLeftAccessory} right={actionFormCellLoader} variant="stack-top" onClick={handleActionFormCellClick} />
                        <ActionFormCell title="Text" description="Description" left={actionFormCellLeftAccessory} right={actionFormCellLoader} variant="stack-middle" onClick={handleActionFormCellClick} />
                        <ActionFormCell title="Text" description="Description" left={actionFormCellLeftAccessory} right={actionFormCellLoader} variant="stack-bottom" onClick={handleActionFormCellClick} />
                    </div>
                    <div></div>
                    <div className="preview-grid__label ts-500-m">Clicks: {actionFormCellClickCount}</div>
                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--label-120-cols-2-wide">
                    <h1 className="component-screen__title ts-600-2xl">Navigation Bar</h1>
                    <div className="preview-grid__header ts-500-m">Links</div>
                    <div className="preview-grid__header ts-500-m">Steps</div>

                    <div className="preview-grid__label ts-500-m">Default</div>
                    <NavigationBar
                        className="navigation-bar-preview"
                        title="Text 2XL"
                        description="Text XS"
                        rootLinkLabel="Text S"
                        items={[
                            { kind: 'link', label: 'Text S' },
                            { kind: 'link', label: 'Text S' },
                            { kind: 'link', label: 'Text S' },
                            { kind: 'link', label: 'Text S' },
                            { kind: 'link', label: 'Text S' },
                        ]}
                    />
                    <NavigationBar
                        className="navigation-bar-preview"
                        title="Text 2XL"
                        rootLinkLabel="Text S"
                        hasDescription={false}
                        items={[
                            { kind: 'step', label: 'Text M', state: 'current' },
                            { kind: 'step', label: 'Text M', state: 'upcoming' },
                            { kind: 'step', label: 'Text M', state: 'upcoming' },
                            { kind: 'step', label: 'Text M', state: 'upcoming' },
                            { kind: 'step', label: 'Text M', state: 'upcoming' },
                        ]}
                    />

                    <div className="preview-grid__label ts-500-m">Optional</div>
                    <NavigationBar
                        className="navigation-bar-preview"
                        title="Text 2XL"
                        hasRootLink={false}
                        hasDescription={false}
                        hasActionButton={false}
                        items={[
                            { kind: 'link', label: 'Text S' },
                            { kind: 'link', label: 'Text S', isDisabled: true },
                        ]}
                    />
                    <NavigationBar
                        className="navigation-bar-preview"
                        title="Text 2XL"
                        hasRootLink={false}
                        hasActionButton={false}
                        hasBackButton={false}
                        hasDescription={false}
                        items={[
                            { kind: 'step', label: 'Text M', state: 'current' },
                            { kind: 'step', label: 'Text M', state: 'upcoming' },
                        ]}
                    />
                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--label-120-cols-2-wide">
                    <h1 className="component-screen__title ts-600-2xl">Navigation Bar Adaptive</h1>
                    <div className="preview-grid__header ts-500-m">Title</div>
                    <div className="preview-grid__header ts-500-m">Right Accessories</div>

                    <div className="preview-grid__label ts-500-m">Title</div>
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="title"
                        title="Text M"
                        rightAccessoryVariant="none"
                    />
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="title"
                        title="Text M"
                        rightAccessoryVariant="icon"
                        rightIcon={<Bell />}
                        rightAriaLabel="Notifications"
                    />

                    <div className="preview-grid__label ts-500-m">Description</div>
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="title-description"
                        title="Text M"
                        description="Text XS"
                        rightAccessoryVariant="icon-icon"
                        rightIcon={<Bell />}
                        secondaryRightIcon={<DotsThreeHorizontal />}
                        rightAriaLabel="Notifications"
                        secondaryRightAriaLabel="More"
                    />
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="title"
                        title="Text M"
                        rightAccessoryVariant="icon-badge"
                        rightIcon={<Bell />}
                        rightAriaLabel="Notifications"
                        badgeValue={3}
                    />

                    <div className="preview-grid__label ts-500-m">Progress</div>
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="step-progress"
                        progress={{ value: 1, maxSteps: 2, ariaLabel: 'Progress: 1 of 2 steps' }}
                        rightAccessoryVariant="action"
                        actionLabel="Text M"
                    />
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="percent-progress"
                        progress={{ value: 80, ariaLabel: 'Progress: 80%' }}
                        rightAccessoryVariant="icon"
                        rightIcon={<DotsThreeHorizontal />}
                        rightAriaLabel="More"
                    />

                    <div className="preview-grid__label ts-500-m">Image</div>
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="image"
                        logo={<span className="ds-icon ds-icon--l"><AppIconTSquare /></span>}
                        rightAccessoryVariant="none"
                    />
                    <NavigationBar
                        isAdaptive
                        className="navigation-bar-adaptive-preview"
                        titleVariant="none"
                        rightAccessoryVariant="action"
                        actionLabel="Text M"
                    />
                    <NavigationBar
                        isAdaptive
                        isInverted
                        className="navigation-bar-adaptive-preview navigation-bar-adaptive-preview--brand"
                        titleVariant="title"
                        title="Text M"
                        rightAccessoryVariant="action"
                        actionLabel="Text M"
                    />
                </div>
            </section>
            <section className="component-screen">
                <h1 className="component-screen__title ts-600-2xl">Main Page Navigation Bar</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                    <MainPageNavigationBar
                        customer="ООО Ромашка"
                        hasLive={true}
                        hasNewPush={true}
                        hasSelect={true}
                        hasSubscription={true}
                        hasTin={true}
                        isSecondLine={true}
                        tin="ИНН 4827 1359 64"
                    />
                </div>
            </section>
            <section className="component-screen">
                <h1 className="component-screen__title ts-600-2xl">Footer</h1>
                <div className="preview-grid preview-grid--footer-demo">
                    <Footer
                        layout={footerLayout}
                        description={isFooterDescriptionVisible ? 'Text S' : undefined}
                        iconAction={{ ariaLabel: 'Дополнительное действие' }}
                        secondaryAction={{ label: 'Действие' }}
                        primaryAction={{ label: 'Действие' }}
                        className="footer-preview"
                    />

                    <div className="preview-cell-controls">
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Дескриптор в футере</span>
                                <Switch
                                    label="Descriptor"
                                    isSelected={isFooterDescriptionVisible}
                                    onChange={setIsFooterDescriptionVisible}
                                />
                            </div>
                        </div>
                        <Dropdown
                            label="Тип"
                            value={footerLayout}
                            hasHelpIcon={false}
                            onChange={(value) => setFooterLayout(value as FooterLayout)}
                            options={[
                                { value: '1-button', label: '1 Button' },
                                { value: '2-buttons-in-line', label: '2 Buttons In Line' },
                                { value: '3-buttons', label: '3 Buttons' },
                                { value: 'page-control-button', label: 'Page Control + Button' },
                                { value: 'stepper-button', label: 'Stepper + Button' },
                            ]}
                        />
                    </div>
                </div>
            </section>
            <section className="component-screen">
                <h1 className="component-screen__title ts-600-2xl">Feedback Banner</h1>
                <div className="preview-grid preview-grid--widget-demo">
                    <FeedbackBanner
                        primaryAction={{ label: 'Text M', onClick: handleActionFormCellClick }}
                        secondaryAction={isFeedbackBannerSecondaryVisible ? { label: 'Text M', onClick: handleActionFormCellClick } : undefined}
                    >
                        Text M
                    </FeedbackBanner>

                    <div className="preview-cell-controls">
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Second action</span>
                                <Switch
                                    label="Second action"
                                    isSelected={isFeedbackBannerSecondaryVisible}
                                    onChange={setIsFeedbackBannerSecondaryVisible}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="component-screen">
                <h1 className="component-screen__title ts-600-2xl">Widget</h1>
                <div className="preview-grid preview-grid--widget-demo">
                    <Widget
                        className="widget-preview"
                        title="Widget"
                        description="Text S"
                        hasDescription={isWidgetDescriptionVisible}
                        hasChevron={isWidgetChevronVisible}
                        rightAccessory={(
                            <WidgetTitleAccessory
                                variant={widgetAccessoryVariant}
                                text={widgetAccessoryVariant === 'description' ? 'Text S' : 'Text M'}
                            />
                        )}
                    >
                        <div className="widget-preview__placeholder" />
                    </Widget>

                    <div className="preview-cell-controls">
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Description</span>
                                <Switch
                                    label="Description"
                                    isSelected={isWidgetDescriptionVisible}
                                    onChange={setIsWidgetDescriptionVisible}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Chevron</span>
                                <Switch
                                    label="Chevron"
                                    isSelected={isWidgetChevronVisible}
                                    onChange={setIsWidgetChevronVisible}
                                />
                            </div>
                        </div>
                        <Dropdown
                            label="Accessory"
                            value={widgetAccessoryVariant}
                            onChange={(value) => setWidgetAccessoryVariant(value as typeof widgetAccessoryVariant)}
                            options={[
                                { value: 'icon', label: 'Icon' },
                                { value: 'link', label: 'Link' },
                                { value: 'link-icon', label: 'Link + Icon' },
                                { value: 'icon-icon', label: 'Icon + Icon' },
                                { value: 'description', label: 'Description' },
                                { value: 'editing-mode', label: 'Editing Mode' },
                                { value: 'none', label: 'None' },
                            ]}
                        />
                    </div>
                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--label-120-cols-2-wide">
                    <h1 className="component-screen__title ts-600-2xl">Page Action</h1>
                    <div className="preview-grid__header ts-500-m">Default</div>
                    <div className="preview-grid__header ts-500-m">Danger</div>

                    <div className="preview-grid__label ts-500-m">Text</div>
                    <PageAction
                        title="Text"
                        leftAccessory={accessoryIcon30}
                        onClick={handleActionFormCellClick}
                        hasDescription={false}
                    />
                    <PageAction
                        title="Text"
                        leftAccessory={accessoryIcon30}
                        variant="danger"
                        onClick={handleActionFormCellClick}
                        hasDescription={false}
                    />

                    <div className="preview-grid__label ts-500-m">Text + Description</div>
                    <PageAction
                        title="Text"
                        description="Description"
                        leftAccessory={accessoryIcon30}
                        onClick={handleActionFormCellClick}
                    />
                    <PageAction
                        title="Text"
                        description="Description"
                        leftAccessory={accessoryIcon30}
                        variant="danger"
                        onClick={handleActionFormCellClick}
                    />
                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--context-menu-demo">
                    <h1 className="component-screen__title ts-600-2xl">Context Menu</h1>
                    <div></div>
                    <div className="preview-cell-controls">
                        <Dropdown
                            label="Расположение"
                            hasHelpIcon={false}
                            value={contextMenuPlacement}
                            onChange={(value) => setContextMenuPlacement(value as 'right' | 'left')}
                            options={[
                                { value: 'right', label: 'Право' },
                                { value: 'left', label: 'Лево' },
                            ]}
                        />
                    </div>

                    <ContextMenu
                        trigger={(
                            <button
                                type="button"
                                className="components-preview__context-menu-trigger hoverOpacity"
                                aria-label="Открыть context menu"
                                onClick={() => setIsContextMenuOpen((value) => !value)}
                            >
                                <span className="ds-icon ds-icon--m" aria-hidden="true">
                                    <DotsThreeHorizontal />
                                </span>
                            </button>
                        )}
                        isOpen={isContextMenuOpen}
                        onClose={() => setIsContextMenuOpen(false)}
                        placement={contextMenuPlacement}
                        items={contextMenuItems}
                    />


                </div>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--context-menu-demo">
                    <h1 className="component-screen__title ts-600-2xl">Tooltip</h1>
                    <div></div>
                    <div className="preview-cell-controls">
                        <Dropdown
                            label="Расположение"
                            hasHelpIcon={false}
                            value={tooltipPlacement}
                            onChange={(value) => setTooltipPlacement(value as 'right' | 'left')}
                            options={[
                                { value: 'right', label: 'Право' },
                                { value: 'left', label: 'Лево' },
                            ]}
                        />
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Несколько абзацев</span>
                                <Switch
                                    label="Несколько абзацев"
                                    isSelected={isTooltipLongText}
                                    onChange={setIsTooltipLongText}
                                />
                            </div>
                        </div>
                    </div>

                    <Tooltip
                        placement={tooltipPlacement}
                        trigger={(
                            <button
                                type="button"
                                className="components-preview__tooltip-trigger"
                                aria-label="Показать tooltip"
                            >
                                <span className="ds-icon ds-icon--m" aria-hidden="true">
                                    <Circle />
                                </span>
                            </button>
                        )}
                    >
                        {tooltipContent}
                    </Tooltip>


                </div>
            </section>

            <section className="component-screen">
                <div className="preview-grid preview-grid--label-120-cols-3-wide">
                    <h1 className="component-screen__title ts-600-2xl">Form Cell</h1>
                    <div className="preview-grid__header ts-500-m">Text</div>
                    <div className="preview-grid__header ts-500-m">Subtitle + Text</div>
                    <div className="preview-grid__header ts-500-m">Text + Description</div>

                    <div className="preview-grid__label ts-500-m">Single</div>
                    <FormCell
                        title="Text"
                        left={formCellLeftAccessory}
                        right={<Switch isSelected={singleSwitchSelected} onChange={setSingleSwitchSelected} label="Switch" />}
                    />
                    <FormCell
                        title="Text"
                        subtitle="Subtitle"
                        left={formCellLeftAccessory}
                        right={<Checkbox isChecked={singleCheckboxSelected} onChange={setSingleCheckboxSelected} label="Checkbox" />}
                    />
                    <FormCell
                        title="Text"
                        description="Description"
                        left={formCellLeftAccessory}
                        right={<Radio isSelected={singleRadioSelected} onChange={() => setSingleRadioSelected((value) => !value)} label="Radio" />}
                    />

                    <div className="preview-grid__label ts-500-m">Group</div>
                    <div className="preview-stack-group">
                        <FormCell
                            title="Text"
                            left={formCellLeftAccessory}
                            right={<Switch isSelected={groupSwitchStates[0]} onChange={(nextValue) => toggleGroupSwitch(0, nextValue)} label="Switch" />}
                            variant="stack-top"
                        />
                        <FormCell
                            title="Text"
                            subtitle="Subtitle"
                            left={formCellLeftAccessory}
                            right={<Switch isSelected={groupSwitchStates[1]} onChange={(nextValue) => toggleGroupSwitch(1, nextValue)} label="Switch" />}
                            variant="stack-middle"
                        />
                        <FormCell
                            title="Text"
                            description="Description"
                            left={formCellLeftAccessory}
                            right={<Switch isSelected={groupSwitchStates[2]} onChange={(nextValue) => toggleGroupSwitch(2, nextValue)} label="Switch" />}
                            variant="stack-bottom"
                        />
                    </div>
                    <div className="preview-stack-group">
                        <FormCell
                            title="Text"
                            left={formCellLeftAccessory}
                            right={<Checkbox isChecked={groupCheckboxStates[0]} onChange={(nextValue) => toggleGroupCheckbox(0, nextValue)} label="Checkbox" />}
                            variant="stack-top"
                        />
                        <FormCell
                            title="Text"
                            subtitle="Subtitle"
                            left={formCellLeftAccessory}
                            right={<Checkbox isChecked={groupCheckboxStates[1]} onChange={(nextValue) => toggleGroupCheckbox(1, nextValue)} label="Checkbox" />}
                            variant="stack-middle"
                        />
                        <FormCell
                            title="Text"
                            description="Description"
                            left={formCellLeftAccessory}
                            right={<Checkbox isChecked={groupCheckboxStates[2]} onChange={(nextValue) => toggleGroupCheckbox(2, nextValue)} label="Checkbox" />}
                            variant="stack-bottom"
                        />
                    </div>
                    <div className="preview-stack-group">
                        <FormCell
                            title="Text"
                            left={formCellLeftAccessory}
                            right={<Radio isSelected={groupRadioSelectedIndex === 0} onChange={() => setGroupRadioSelectedIndex(0)} label="Radio" />}
                            variant="stack-top"
                        />
                        <FormCell
                            title="Text"
                            subtitle="Subtitle"
                            left={formCellLeftAccessory}
                            right={<Radio isSelected={groupRadioSelectedIndex === 1} onChange={() => setGroupRadioSelectedIndex(1)} label="Radio" />}
                            variant="stack-middle"
                        />
                        <FormCell
                            title="Text"
                            description="Description"
                            left={formCellLeftAccessory}
                            right={<Radio isSelected={groupRadioSelectedIndex === 2} onChange={() => setGroupRadioSelectedIndex(2)} label="Radio" />}
                            variant="stack-bottom"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
