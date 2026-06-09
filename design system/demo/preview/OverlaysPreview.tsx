import React, { useState } from 'react';
import {
    ActionSheet,
    ActionSheetButton,
    ActionSheetFooter,
    ActionSheetHeader,
    Button,
    Drawer,
    DrawerFooter,
    DrawerHeader,
    DrawerHeaderTitle,
    Dropdown,
    Modal,
    ModalFooter,
    ModalHeader,
    Switch,
} from '../../src';
import { Circle } from '../../src/icons';

export const OverlaysPreview: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDrawerBackButtonVisible, setIsDrawerBackButtonVisible] = useState(true);
    const [isDrawerFooterDescriptionVisible, setIsDrawerFooterDescriptionVisible] = useState(true);
    const [drawerFooterLayout, setDrawerFooterLayout] = useState<'1-button' | '2-buttons' | '2-horizontal-buttons' | 'empty'>('2-horizontal-buttons');
    const [isDrawerPrimarySelected, setIsDrawerPrimarySelected] = useState(true);
    const [isDrawerSecondarySelected, setIsDrawerSecondarySelected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalBackButtonVisible, setIsModalBackButtonVisible] = useState(false);
    const [isModalLongContent, setIsModalLongContent] = useState(false);
    const [isModalFooterDescriptionVisible, setIsModalFooterDescriptionVisible] = useState(false);
    const [modalFooterLayout, setModalFooterLayout] = useState<'none' | '1-button' | '2-buttons' | '2-horizontal-buttons'>('1-button');
    const [isModalPrimarySelected, setIsModalPrimarySelected] = useState(true);
    const [isModalSecondarySelected, setIsModalSecondarySelected] = useState(false);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [isActionSheetMultiAction, setIsActionSheetMultiAction] = useState(false);
    const [isActionSheetHeaderVisible, setIsActionSheetHeaderVisible] = useState(true);
    const [isActionSheetDanger, setIsActionSheetDanger] = useState(false);
    const [isActionSheetIconVisible, setIsActionSheetIconVisible] = useState(false);
    const [isActionSheetDescriptionVisible, setIsActionSheetDescriptionVisible] = useState(false);
    const demoIcon = <Circle />;

    const drawerFooter = (
        <DrawerFooter
            layout={drawerFooterLayout}
            description={isDrawerFooterDescriptionVisible ? 'Description' : undefined}
            primaryAction={{
                label: 'Primary',
                isSelected: isDrawerPrimarySelected,
                onClick: () => {
                    setIsDrawerPrimarySelected(true);
                    setIsDrawerSecondarySelected(false);
                },
            }}
            secondaryAction={drawerFooterLayout === '1-button' ? undefined : {
                label: 'Secondary',
                isSelected: isDrawerSecondarySelected,
                onClick: () => {
                    setIsDrawerPrimarySelected(false);
                    setIsDrawerSecondarySelected(true);
                },
            }}
        />
    );

    const modalFooter = modalFooterLayout === 'none'
        ? undefined
        : (
            <ModalFooter
                layout={modalFooterLayout}
                description={isModalFooterDescriptionVisible ? 'Description' : undefined}
                primaryAction={{
                    label: 'Primary',
                    isSelected: isModalPrimarySelected,
                    onClick: () => {
                        setIsModalPrimarySelected(true);
                        setIsModalSecondarySelected(false);
                    },
                }}
                secondaryAction={modalFooterLayout === '1-button' ? undefined : {
                    label: 'Secondary',
                    isSelected: isModalSecondarySelected,
                    onClick: () => {
                        setIsModalPrimarySelected(false);
                        setIsModalSecondarySelected(true);
                    },
                }}
            />
        );

    const modalParagraphs = isModalLongContent
        ? Array.from({ length: 12 }, (_, index) => (
            <p key={`modal-long-paragraph-${index}`} className="components-preview__modal-text ts-400-m">
                Long modal content paragraph {index + 1}. This block is used to check internal scrolling, content clipping and compact header state while the footer remains fixed.
            </p>
        ))
        : (
            <>
                <p className="components-preview__modal-text ts-400-m">
                    Short modal content for the default state.
                </p>
                <div className="components-preview__modal-placeholder" />
            </>
        );

    const actionSheetButtons = (isActionSheetMultiAction
        ? [
            { key: 'primary', title: 'Основное действие', description: 'Описание действия' },
            { key: 'secondary', title: 'Дополнительное действие', description: 'Описание действия' },
            { key: 'tertiary', title: 'Ещё действие', description: 'Описание действия' },
        ]
        : [
            { key: 'primary', title: 'Основное действие', description: 'Описание действия' },
        ]
    ).map((item) => (
        <ActionSheetButton
            key={item.key}
            title={item.title}
            description={item.description}
            hasDescription={isActionSheetDescriptionVisible}
            icon={demoIcon}
            hasIcon={isActionSheetIconVisible}
            variant={isActionSheetDanger ? 'danger' : 'default'}
            onClick={() => setIsActionSheetOpen(false)}
        />
    ));

    return (
        <div className="tab-panel is-active">
            <section className="component-screen">
                <div className="preview-grid preview-grid--modal-demo">
                    <h1 className="component-screen__title ts-600-2xl">Drawer</h1>
                    <div></div>

                    <Button className="components-preview__drawer-trigger" onClick={() => setIsDrawerOpen(true)}>
                        Open Drawer
                    </Button>

                    <div className="preview-cell-controls">
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Кнопка назад</span>
                                <Switch
                                    label="Кнопка назад"
                                    isSelected={isDrawerBackButtonVisible}
                                    onChange={setIsDrawerBackButtonVisible}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Дескриптор в футере</span>
                                <Switch
                                    label="Дескриптор в футере"
                                    isSelected={isDrawerFooterDescriptionVisible}
                                    onChange={setIsDrawerFooterDescriptionVisible}
                                />
                            </div>
                        </div>

                        <Dropdown
                            label="Футер"
                            value={drawerFooterLayout}
                            hasHelpIcon={false}
                            onChange={(value) => setDrawerFooterLayout(value as typeof drawerFooterLayout)}
                            options={[
                                { value: '1-button', label: '1 Button' },
                                { value: '2-buttons', label: '2 Buttons' },
                                { value: '2-horizontal-buttons', label: '2 Horizontal Buttons' },
                                { value: 'empty', label: 'Empty' },
                            ]}
                        />
                    </div>
                </div>

                <Drawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    header={(
                        <DrawerHeader
                            title={<DrawerHeaderTitle variant="text-m">Drawer Title</DrawerHeaderTitle>}
                            hasDefaultBackArrow={isDrawerBackButtonVisible}
                            onLeftAccessoryClick={isDrawerBackButtonVisible ? () => setIsDrawerOpen(false) : undefined}
                            onClose={() => setIsDrawerOpen(false)}
                        />
                    )}
                    footer={drawerFooter}
                >
                    <div className="components-preview__drawer-body">
                        <div className="components-preview__drawer-placeholder" />
                    </div>
                </Drawer>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--modal-demo">
                    <h1 className="component-screen__title ts-600-2xl">Action Sheet</h1>
                    <div></div>

                    <Button className="components-preview__action-sheet-trigger" onClick={() => setIsActionSheetOpen(true)}>
                        Open Action Sheet
                    </Button>

                    <div className="preview-cell-controls">
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Текст в хедере</span>
                                <Switch
                                    label="Текст в хедере"
                                    isSelected={isActionSheetHeaderVisible}
                                    onChange={setIsActionSheetHeaderVisible}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Несколько кнопок</span>
                                <Switch
                                    label="Несколько кнопок"
                                    isSelected={isActionSheetMultiAction}
                                    onChange={setIsActionSheetMultiAction}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Иконка</span>
                                <Switch
                                    label="Иконка"
                                    isSelected={isActionSheetIconVisible}
                                    onChange={setIsActionSheetIconVisible}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Дескриптор</span>
                                <Switch
                                    label="Дескриптор"
                                    isSelected={isActionSheetDescriptionVisible}
                                    onChange={setIsActionSheetDescriptionVisible}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Danger состояние</span>
                                <Switch
                                    label="Danger состояние"
                                    isSelected={isActionSheetDanger}
                                    onChange={setIsActionSheetDanger}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <ActionSheet
                    isOpen={isActionSheetOpen}
                    onClose={() => setIsActionSheetOpen(false)}
                    header={(
                        <ActionSheetHeader
                            title="Action Sheet Title"
                            description="Description"
                            hasContent={isActionSheetHeaderVisible}
                        />
                    )}
                    footer={<ActionSheetFooter onClick={() => setIsActionSheetOpen(false)} />}
                >
                    <div className="components-preview__action-sheet-body">
                        {actionSheetButtons}
                    </div>
                </ActionSheet>
            </section>
            <section className="component-screen">
                <div className="preview-grid preview-grid--modal-demo">
                    <h1 className="component-screen__title ts-600-2xl">Modal</h1>
                    <div></div>

                    <Button className="components-preview__modal-trigger" onClick={() => setIsModalOpen(true)}>
                        Open Modal
                    </Button>

                    <div className="preview-cell-controls">
                        <div className="preview-cell-switches">
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Кнопка назад</span>
                                <Switch
                                    label="Кнопка назад"
                                    isSelected={isModalBackButtonVisible}
                                    onChange={setIsModalBackButtonVisible}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Длинный контентt</span>
                                <Switch
                                    label="Длинный контент"
                                    isSelected={isModalLongContent}
                                    onChange={setIsModalLongContent}
                                />
                            </div>
                            <div className="preview-cell-switches__item">
                                <span className="ts-500-m">Дескриптор в футере</span>
                                <Switch
                                    label="Дескриптор в футере"
                                    isSelected={isModalFooterDescriptionVisible}
                                    onChange={setIsModalFooterDescriptionVisible}
                                />
                            </div>
                        </div>

                        <Dropdown
                            label="Футер"
                            value={modalFooterLayout}
                            hasHelpIcon={false}
                            onChange={(value) => setModalFooterLayout(value as typeof modalFooterLayout)}
                            options={[
                                { value: 'none', label: 'None' },
                                { value: '1-button', label: '1 Button' },
                                { value: '2-buttons', label: '2 Buttons' },
                                { value: '2-horizontal-buttons', label: '2 Horizontal Buttons' },
                            ]}
                        />
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    header={(
                        <ModalHeader
                            title="Modal Title"
                            hasDefaultBackArrow={isModalBackButtonVisible}
                            onLeftAccessoryClick={isModalBackButtonVisible ? () => setIsModalOpen(false) : undefined}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                    footer={modalFooter}
                >
                    <div className="components-preview__modal-body">
                        {modalParagraphs}
                    </div>
                </Modal>
            </section>
        </div>
    );
};
